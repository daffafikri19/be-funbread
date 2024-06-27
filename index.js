"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const flmngr_server_node_express_1 = require("@flmngr/flmngr-server-node-express");
const auth_1 = __importDefault(require("./api/routes/auth"));
const user_1 = __importDefault(require("./api/routes/user"));
const product_1 = __importDefault(require("./api/routes/product"));
const ingredient_1 = __importDefault(require("./api/routes/ingredient"));
const report_1 = __importDefault(require("./api/routes/report"));
const recipe_1 = __importDefault(require("./api/routes/recipe"));
const summary_1 = __importDefault(require("./api/routes/summary"));
const access_1 = __importDefault(require("./api/routes/access"));
dotenv_1.default.config();
process.env.TZ = 'Asia/Jakarta';
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["https://admin.funbread.my.id"],
    credentials: true,
}));
app.use(auth_1.default);
app.use(user_1.default);
app.use(product_1.default);
app.use(ingredient_1.default);
app.use(report_1.default);
app.use(recipe_1.default);
app.use(summary_1.default);
app.use(access_1.default);
(0, flmngr_server_node_express_1.bindFlmngr)({
    app: app,
    urlFileManager: "/flmngr",
    urlFiles: "/files/",
    dirFiles: "./files",
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Application running...");
}));
app.listen(5000, () => {
    console.log(`server successfully running at http://localhost:5000`);
});
