import { Response } from 'express';
import prisma from '../db';
import { AuthenticatedRequest } from '../middleware/auth';

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be signed in to book a charging slot.' }
      });
    }

    const { stationId, connectorId, bookingDate, startTime, endTime, vehicleType, amount } = req.body;

    if (!stationId || !connectorId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Station, connector, date, and time slot are required.' }
      });
    }

    // Verify connector exists
    const connector = await prisma.connector.findUnique({
      where: { id: connectorId },
      include: { station: true }
    });

    if (!connector || connector.stationId !== stationId) {
      return res.status(404).json({
        success: false,
        error: { code: 'CONNECTOR_NOT_FOUND', message: 'The selected charging connector was not found at this station.' }
      });
    }

    const newStartMins = timeToMinutes(startTime);
    const newEndMins = timeToMinutes(endTime);

    if (newEndMins <= newStartMins) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_DURATION', message: 'End time must be after start time.' }
      });
    }

    // CHECK FOR OVERLAPPING BOOKINGS ON THE SAME CONNECTOR & DATE
    const existingBookings = await prisma.booking.findMany({
      where: {
        connectorId,
        bookingDate,
        status: 'CONFIRMED'
      }
    });

    const hasConflict = existingBookings.some(b => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      // Overlap condition: max(start1, start2) < min(end1, end2)
      return Math.max(newStartMins, bStart) < Math.min(newEndMins, bEnd);
    });

    if (hasConflict) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'SLOT_CONFLICT',
          message: 'That charging slot is no longer available on this connector. Please choose an alternative time or connector.'
        }
      });
    }

    // Generate reference EVN-2026-XXXXXX
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingReference = `EVN-2026-${randomSuffix}`;
    const durationHours = (newEndMins - newStartMins) / 60.0;
    const finalAmount = amount || durationHours * connector.pricePerKWh * 25.0;

    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        userId,
        stationId,
        connectorId,
        bookingDate,
        startTime,
        endTime,
        durationHours,
        amount: Math.round(finalAmount * 100) / 100,
        vehicleType: vehicleType || 'Standard EV',
        status: 'CONFIRMED'
      },
      include: {
        station: true,
        connector: true
      }
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Charging Slot Reserved',
        message: `Booking ${bookingReference} confirmed at ${connector.station.name} on ${bookingDate} at ${startTime}.`,
        type: 'BOOKING'
      }
    });

    return res.status(201).json({
      success: true,
      data: { booking }
    });
  } catch (error: any) {
    console.error('createBooking error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to complete charging slot reservation.' }
    });
  }
}

export async function getUserBookings(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' } });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        station: true,
        connector: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: { bookings }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to retrieve your bookings.' }
    });
  }
}

export async function cancelBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const id = req.params.id as string;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { station: true }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOKING_NOT_FOUND', message: 'Booking record not found.' }
      });
    }

    // Must be owner or admin
    if (booking.userId !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to cancel this booking.' }
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { station: true }
    });

    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'Booking Cancelled',
        message: `Your booking ${booking.bookingReference} for ${booking.station.name} was cancelled.`,
        type: 'ALERT'
      }
    });

    return res.status(200).json({
      success: true,
      data: { booking: updatedBooking }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Unable to cancel booking.' }
    });
  }
}
