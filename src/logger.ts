import path from "path";
import pino from "pino";
import pinoLogger from "pino";

const fileTransport = pino.transport({
  target: "pino/file",
  options: { destination: path.join(__dirname, "..", "app.log") },
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  fileTransport
);

export default logger;
