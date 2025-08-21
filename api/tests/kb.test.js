describe("KB API", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ name: "Admin", email: "admin@test.com", password: "123456", role: "admin" });
    token = res.body.token;
  });

  it("should create KB article", async () => {
    const res = await request(app)
      .post("/api/kb")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Reset password", body: "Click Forgot Password", tags: ["password"] });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Reset password");
  });

  it("should search KB", async () => {
    const res = await request(app)
      .get("/api/kb?query=password")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toContain("password");
  });
});
