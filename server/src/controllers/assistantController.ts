import { Request, Response } from 'express';

const ASSISTANT_KNOWLEDGE: { [key: string]: string } = {
  gap: "EVision's Infrastructure Gap Score (0-100) measures regional public charger deficit. It is calculated as: Gap Score = 0.30 * Deficit + 0.30 * Ratio Pressure + 0.20 * Growth Velocity + 0.20 * Urbanization. Scores >= 75 represent Critical Gap status.",
  formula: "The mathematical formula is: Gap Score = 0.30 * Deficit + 0.30 * Ratio Pressure + 0.20 * Growth Velocity + 0.20 * Urbanization.",
  book: "To book a charging slot: 1. Go to 'Find Charger' or 'Map', 2. Click 'Book Slot' on your chosen station, 3. Select your connector type, date, and preferred time, 4. Confirm to receive an instant reference code (e.g. EVN-2026-XXXXXX).",
  eda: "Our Exploratory Data Analysis reveals that national EV registrations expanded +42.8% YoY in 2025 while public charger rollout grew +18.4% YoY. This 24.4% disparity has elevated the national average to 171.4 EVs per station across 12 high-pressure states.",
  model: "EVision utilizes state-level Log-Linear Regression models for longitudinal adoption forecasts and Random Forest Regressors to project required public charging station capacity up to 2030.",
  dataset: "The dataset synthesizes 192 longitudinal records (2020-2025) across 32 Indian States and Union Territories sourced from official VAHAN analytics, Bureau of Energy Efficiency (BEE), and Census demographic data.",
  status: "Charging station statuses: ACTIVE (station operational and accepting bookings), INACTIVE (temporarily closed), and MAINTENANCE (hardware undergoing certified inspection).",
  directions: "Click 'Get Directions' on any station card or map popup to open turn-by-turn navigation in Google Maps or your native GPS app using the exact latitude and longitude coordinates."
};

export async function askAssistant(req: Request, res: Response) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Question text is required.' }
      });
    }

    const q = question.toLowerCase();

    let answer = "I don't have enough verified data to answer that specific query right now. You can ask me about finding charging stations, how to book a slot, the Infrastructure Gap formula, or EDA findings.";

    if (q.includes('gap') || q.includes('deficit') || q.includes('pressure')) {
      answer = ASSISTANT_KNOWLEDGE.gap;
    } else if (q.includes('formula') || q.includes('equation') || q.includes('calculate')) {
      answer = ASSISTANT_KNOWLEDGE.formula;
    } else if (q.includes('book') || q.includes('reserve') || q.includes('slot') || q.includes('schedule')) {
      answer = ASSISTANT_KNOWLEDGE.book;
    } else if (q.includes('eda') || q.includes('growth') || q.includes('insight') || q.includes('trend')) {
      answer = ASSISTANT_KNOWLEDGE.eda;
    } else if (q.includes('model') || q.includes('ml') || q.includes('forecast') || q.includes('predict')) {
      answer = ASSISTANT_KNOWLEDGE.model;
    } else if (q.includes('data') || q.includes('source') || q.includes('vahan') || q.includes('bee')) {
      answer = ASSISTANT_KNOWLEDGE.dataset;
    } else if (q.includes('status') || q.includes('active') || q.includes('maintenance')) {
      answer = ASSISTANT_KNOWLEDGE.status;
    } else if (q.includes('direction') || q.includes('map') || q.includes('navigate') || q.includes('location')) {
      answer = ASSISTANT_KNOWLEDGE.directions;
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
      answer = "Hello! I am EVA (EVision Assistant). I can help you locate chargers, guide slot bookings, explain our Infrastructure Gap formula, or summarize national EV adoption data.";
    }

    return res.status(200).json({
      success: true,
      data: { answer }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Assistant service temporarily unavailable.' }
    });
  }
}
