const fakeUsers = {
  facebook_existing: {
    id: '2467093749978894',
    username: undefined,
    displayName: undefined,
    name:
        {
          familyName: 'Kuku',
          givenName: 'Anguandia',
          middleName: 'Mike'
        },
    gender: undefined,
    profileUrl: undefined,
    emails: [{ value: 'anguamike@yahoo.com' }],
    photos:
            [{
              value:
                    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2467093749978894&height=50&width=50&ext=1568336277&hash=AeQTmX6T-4sjcO2y'
            }],
    provider: 'facebook'
  },
  google_existing: {
    id: '100027718370607337396',
    displayName: 'Admin Admin',
    name: { familyName: 'Admin', givenName: 'Admin' },
    emails: [{ value: 'admin@gmail.com', verified: true }],
    photos:
            [{
              value:
                    'https://lh4.googleusercontent.com/-hwkYMcorxvo/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rec-AyRoK1mZklL6nXZuisrmnBpxw/photo.jpg'
            }],
    provider: 'google',
  },

  twitter_existing: {
    id: '1159372707424854016',
    username: 'MAnguandia',
    displayName: 'mike anguandia',
    photos:
            [{
              value:
                    'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
            }],
    provider: 'twitter'
  },
  facebook_new: {
    id: '2467093749978894',
    username: undefined,
    displayName: undefined,
    name:
        {
          familyName: 'Kuku',
          givenName: 'Anguandia',
          middleName: 'Mike'
        },
    gender: undefined,
    profileUrl: undefined,
    emails: [{ value: 'user2@yahoo.com' }],
    photos:
            [{
              value:
                    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2467093749978894&height=50&width=50&ext=1568336277&hash=AeQTmX6T-4sjcO2y'
            }],
    provider: 'facebook'
  },
  google_new: {
    id: '100027718370607337396',
    displayName: 'Three Four',
    name: { familyName: 'Three', givenName: 'Four' },
    emails: [{ value: 'thirtyfour@gmail.com', verified: true }],
    photos:
            [{
              value:
                    'https://lh4.googleusercontent.com/-hwkYMcorxvo/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rec-AyRoK1mZklL6nXZuisrmnBpxw/photo.jpg'
            }],
    provider: 'google'
  },

  twitter_new: {
    id: '1159372707424854016',
    username: 'Testuser4',
    displayName: 'testa asera',
    photos:
            [{
              value:
                    'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
            }],
    provider: 'twitter'
  }
};

export default fakeUsers;
