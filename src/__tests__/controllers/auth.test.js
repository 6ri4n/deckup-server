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
};

const next = jest.fn((x) => x);

jest.mock("../../database/models/user");

describe("testing sign-up user", () => {
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
