module.exports = {
  servers: {
    one: {
      host: 'xxx',
      username: 'ubuntu',
      pem: 'cert.pem'
    }
  },

  meteor: {
    "dockerImage": "abernix/meteord:base",
    name: 'WhoCites',
    path: '/bibnet/',
    servers: {
      one: {}
    },
    ssl: {
      crt: "fullchain.pem",
      key: "privkey.pem",
      port: 443
    },    
    buildOptions: { 
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'https://whocites.com',
      MONGO_URL: 'mongodb://xxx'
    },
    deployCheckWaitTime: 240
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};