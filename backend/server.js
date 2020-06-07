const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("koa2-cors");
const koaBody = require("koa-body");

const app = new Koa();

// CORS
app.use(async(ctx, next) => {
    const origin = ctx.request.get("Origin");
    if (!origin) {
        return await next();
    }
    const headers = { "Access-Control-Allow-Origin": "*" };
    if (ctx.request.method !== "OPTIONS") {
        ctx.response.set({...headers });
        try {
            return await next();
        } catch (e) {
            e.headers = {...e.headers, ...headers };
            throw e;
        }
    }
    if (ctx.request.get("Access-Control-Request-Method")) {
        ctx.response.set({
            ...headers,
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
        });
        if (ctx.request.get("Access-Control-Request-Headers")) {
            ctx.response.set(
                "Access-Control-Allow-Headers",
                ctx.request.get("Access-Control-Request-Headers")
            );
        }
        ctx.response.status = 204;
    }
});

app.use(cors());
app.use(koaBody({ json: true }));

const notes = [{
    content: "First note",
    id: "0",
}, ];

const router = new Router();

router
    .get("/notes", async(ctx, next) => {
        ctx.response.body = notes;
    })
    .post("/notes", async(ctx, next) => {
        console.log(ctx.request.body);
        notes.push({...ctx.request.body });
        ctx.response.status = 204;
    })
    .delete("/notes/:id", async(ctx, next) => {
        const noteId = ctx.params.id;
        const index = notes.findIndex((o) => o.id === noteId);
        if (index !== -1) {
            notes.splice(index, 1);
        }
        ctx.response.status = 204;
    });

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));