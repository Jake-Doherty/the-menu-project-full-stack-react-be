const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user for testing
const mockUser = {
  email: 'test@menuapp.com',
  password: 'justtherecipe',
};

const mockProfile = {
  user_id: '1',
  displayName: 'Test User',
  bio: 'This is a test bio',
  avatar_image_url: 'https://www.test.com',
  dark_mode: true,
  created_at: '2021-08-01T00:00:00.000Z',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v2/users/sessions').send({ email, password });
  return [agent, user];
};

describe('profile routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('/ creates a new profile for signed in user', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.post('/api/v2/profile').send(mockProfile);
    expect(res.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      display_name: mockProfile.displayName,
      bio: mockProfile.bio,
      avatar_image_url: mockProfile.avatar_image_url,
      dark_mode: mockProfile.dark_mode,
      created_at: expect.any(String),
    });
  });
});
