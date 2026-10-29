"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHaversineDistance = calculateHaversineDistance;
/**
 * Calculates great-circle distance between two points in kilometers
 * using the Haversine trigonometric formula.
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371.0; // Earth's mean radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
    const dLon = ((lon2 - lon1) * Math.PI) / 180.0;
    const a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
        Math.cos((lat1 * Math.PI) / 180.0) *
            Math.cos((lat2 * Math.PI) / 180.0) *
            Math.sin(dLon / 2.0) *
            Math.sin(dLon / 2.0);
    const c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}
