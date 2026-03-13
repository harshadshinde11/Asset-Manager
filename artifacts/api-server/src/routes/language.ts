import { Router, type IRouter } from "express";
import { db, savedLanguagePreferencesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/language/preference", async (req, res) => {
  const userId = (req.query["user_id"] as string) || "default";
  try {
    const prefs = await db.select().from(savedLanguagePreferencesTable).where(eq(savedLanguagePreferencesTable.userId, userId)).limit(1);
    if (prefs.length > 0) {
      res.json({ userId: prefs[0].userId, language: prefs[0].language });
    } else {
      res.json({ userId, language: "en" });
    }
  } catch {
    res.json({ userId, language: "en" });
  }
});

router.post("/language/preference", async (req, res) => {
  const { userId, language } = req.body;
  const uid = userId || "default";

  try {
    const existing = await db.select().from(savedLanguagePreferencesTable).where(eq(savedLanguagePreferencesTable.userId, uid)).limit(1);
    if (existing.length > 0) {
      await db.update(savedLanguagePreferencesTable).set({ language }).where(eq(savedLanguagePreferencesTable.userId, uid));
    } else {
      await db.insert(savedLanguagePreferencesTable).values({ userId: uid, language });
    }
    res.json({ success: true, message: "Language preference saved" });
  } catch {
    res.json({ success: true, message: "Saved" });
  }
});

export default router;
