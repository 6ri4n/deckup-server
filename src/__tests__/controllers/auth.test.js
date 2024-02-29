const User = require("../../database/models/user");
const { signupUser, loginUser, logoutUser } = require("../../controllers/auth");

const request = {
  body: {
    username: "test",
    password: "test",
  },
};

const response = {
  status: jest.fn((x) => x),
  cookie: jest.fn((x) => x),
  clearCookie: jest.fn((x) => x),
};

const next = jest.fn((x) => x);

jest.mock("../../database/models/user");
jest.mock("bcrypt", () => ({
  hash: jest.fn((x) => x),
  compare: jest.fn(() => true),
}));

describe("testing user sign-up", () => {
  it("should send a 400 status code when a field is missing", async () => {
    const signupRequests = [
      { body: { username: "test1" } },
      { body: { password: "test1" } },
      { body: {} },
    ];

    for (const request of signupRequests) {
      await signupUser(request, response, next);
      expect(response.status).toHaveBeenCalledWith(400);
    }
  });

  it("should send a 400 status code when a username is not available", async () => {
    User.findOne.mockImplementationOnce(() => ({ id: 1 }));
    await signupUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("should send a 200 status code when a user is created", async () => {
    User.findOne.mockImplementationOnce(() => undefined);
    User.create.mockImplementationOnce(() => ({ id: 1 }));
    await signupUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should send a 500 status code when a server error occurs", async () => {
    User.findOne.mockImplementationOnce(() => {
      throw new Error("Internal DB Error from finding a user");
    });
    await signupUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(500);

    User.findOne.mockImplementationOnce(() => undefined);
    User.create.mockImplementationOnce(() => {
      throw new Error("Internal DB Error from creating a user");
    });
    await signupUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(500);
  });
});

describe("testing user login", () => {
  it("should send a 400 status code when a field is missing", async () => {
    const loginRequests = [
      { body: { username: "test1" } },
      { body: { password: "test1" } },
      { body: {} },
    ];

    for (const request of loginRequests) {
      await loginUser(request, response, next);
      expect(response.status).toHaveBeenCalledWith(400);
    }
  });

  it("should send a 200 status code when a user logs in", async () => {
    User.findOne.mockImplementationOnce(() => ({ id: 1 }));
    await loginUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("should send a 401 status code when a user is not found", async () => {
    User.findOne.mockImplementationOnce(() => undefined);
    await loginUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("should send a 500 status code when a server error occurs", async () => {
    User.findOne.mockImplementationOnce(() => {
      throw new Error("Internal DB Error from finding a user");
    });
    await loginUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(500);
  });
});

describe("testing user logout", () => {
  it("should send a 200 status code when a user logs out", async () => {
    await loginUser(request, response, next);
    expect(response.status).toHaveBeenCalledWith(200);
  });
});
