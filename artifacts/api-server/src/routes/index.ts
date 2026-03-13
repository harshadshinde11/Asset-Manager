import { Router, type IRouter } from "express";
import healthRouter from "./health";
import weatherRouter from "./weather";
import cropsRouter from "./crops";
import marketRouter from "./market";
import chatbotRouter from "./chatbot";
import pestRouter from "./pest";
import marketplaceRouter from "./marketplace";
import landRouter from "./land";
import shopsRouter from "./shops";
import newsRouter from "./news";
import languageRouter from "./language";

const router: IRouter = Router();

router.use(healthRouter);
router.use(weatherRouter);
router.use(cropsRouter);
router.use(marketRouter);
router.use(chatbotRouter);
router.use(pestRouter);
router.use(marketplaceRouter);
router.use(landRouter);
router.use(shopsRouter);
router.use(newsRouter);
router.use(languageRouter);

export default router;
