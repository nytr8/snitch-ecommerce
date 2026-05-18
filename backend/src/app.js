import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import helmet from "helmet";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "http://localhost:5173"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },

    frameguard: {
      action: "deny",
    },

    noSniff: true,

    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    referrerPolicy: {
      policy: "no-referrer",
    },

    crossOriginOpenerPolicy: {
      policy: "same-origin",
    },

    crossOriginResourcePolicy: {
      policy: "same-origin",
    },

    crossOriginEmbedderPolicy: false,

    permittedCrossDomainPolicies: {
      permittedPolicies: "none",
    },

    hidePoweredBy: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

export default app;
