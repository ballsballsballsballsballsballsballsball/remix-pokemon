import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

/// https://gist.github.com/esamattis/d1172371b0efc1327b8617de6e044f64
export function useLoaderDataTyped<T extends (arg: any) => any>(): Awaited<
  ReturnType<T>
> {
  return useLoaderData() as Awaited<ReturnType<T>>;
}

export function useActionDataTyped<T extends (arg: any) => any>():
  | Awaited<ReturnType<T>>
  | undefined {
  return useActionData() as Awaited<ReturnType<T>> | undefined;
}

export function jsonTyped<T>(data: T, init?: Parameters<typeof json>[1]): T {
  return json(data, init) as any; // LIE, but practical 😎
}
///
