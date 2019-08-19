const fakeUpload = {
  body: {
    title: 'profile picture',
    description: 'my pp',
    body: 'andela',
    taglist: 'andela python js\n'
  },
  auth: {
    id: 1,
    email: 'admin@gmail.com',
    role: 'admin',
    verified: true,
    iat: 1565868674,
    exp: 1565955074
  },
  files: [
    {
      fieldname: 'images',
      originalname: 'Photo on 03-07-2019 at 10.26.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: '/var/folders/tv/6sgpkc254kq8fcvsgdpmv6h40000gn/T',
      filename: 'ae9255b86fcf8b3e650b89c400fc862e',
      path: '/var/folders/tv/6sgpkc254kq8fcvsgdpmv6h40000gn/T/ae9255b86fcf8b3e650b89c400fc862e',
      size: 190307
    }
  ]
};

export default fakeUpload;
