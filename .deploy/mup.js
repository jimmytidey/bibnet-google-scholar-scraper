module.exports = {
  servers: {
    one: {
      host: '52.49.185.232',
      username: 'ubuntu',
      pem: '/Users/jimmytidey/projects/mup_scripts/whocites_deploy/cron_deploy/Localnets.pem'
    }
  },

  meteor: {
    "dockerImage": "abernix/meteord:base",
    name: 'WhoCites',
    path: '/Users/jimmytidey/projects/bibnet/',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      ROOT_URL: 'http://whocites.com',
      MONGO_URL: 'mongodb://localhost/meteor'
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
