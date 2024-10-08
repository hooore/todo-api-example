import { jwt } from "hono/jwt";

import type { AppType } from "./app";

import { Identifier } from "./lib/identifer";

import { initTodoHttpHandler } from "./features/todo/http.handler";
import { TodoRepository } from "./features/todo/repository";
import { TodoService } from "./features/todo/service";
import { FileStorage } from "./lib/file-storage";

export function initRoute(honoApp: AppType) {
  const identifier = new Identifier();
  const fileStorage = new FileStorage();

  const jwtMiddleware = jwt({
    secret: process.env.JWT_ACCESS_SECRET,
  });

  const todoRepository = new TodoRepository();
  const todoService = new TodoService(identifier, fileStorage, todoRepository);
  const todoHttpHandler = initTodoHttpHandler(
    {
      todoService,
    },
    jwtMiddleware,
  );
  honoApp.route("/api/v1/todo", todoHttpHandler.apiRoute);
}
