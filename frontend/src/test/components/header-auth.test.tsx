import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt || ""} {...props} />
  ),
}));

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Header } from "@/components/common/Header";

const LOGIN_USER = {
  id: "user1",
  primerNombre: "Misael",
  apellido: "Prueba",
  email: "misael@test.com",
  rol: "USER",
  telefono: null,
  cedula: null,
  fotoPerfil: null,
};

function mockLoginSuccess() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, user: LOGIN_USER, message: "ok" }),
    }),
  );
}

function UpdateUserHarness() {
  const { updateUser } = useAuth();
  return (
    <>
      <Header />
      <button onClick={() => updateUser(LOGIN_USER)}>simulate-verify</button>
    </>
  );
}

describe("Header auth reactivity", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows user profile immediately after login without reload", async () => {
    mockLoginSuccess();

    render(
      <AuthProvider>
        <Header />
      </AuthProvider>,
    );

    const loginButtons = screen.getAllByRole("button", {
      name: /iniciar sesión/i,
    });
    expect(loginButtons.length).toBeGreaterThan(0);

    await userEvent.click(loginButtons[0]);

    const emailInput = screen.getByPlaceholderText("tu@email.com");
    await userEvent.type(emailInput, "misael@test.com");

    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    await userEvent.type(passwordInputs[0], "password123");

    const submitButton = document.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Misael")).toBeTruthy();
    });

    expect(
      screen.queryByRole("button", { name: /iniciar sesión/i }),
    ).toBeNull();
  });

  it("shows user profile after updateUser (register/verify flow) without reload", async () => {
    render(
      <AuthProvider>
        <UpdateUserHarness />
      </AuthProvider>,
    );

    expect(screen.queryByText("Misael")).toBeNull();

    await userEvent.click(
      screen.getByRole("button", { name: "simulate-verify" }),
    );

    expect(screen.getByText("Misael")).toBeTruthy();

    expect(
      screen.queryByRole("button", { name: /iniciar sesión/i }),
    ).toBeNull();
  });
});
