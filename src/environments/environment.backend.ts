export const environment= {

  production: false,
  appTitle: 'HAFAS API Manager',
  clientId: 'HAFAS Standard',

  basePath: '',
  api: {
    auth: {
      signin: 'api/auth/signin',
      signout: 'api/auth/signout'
    },
    users: {
      base: 'api/users',
      getAllPageable: 'api/users/page',
      updateStatus:'api/users/update-status'
    },
    systemLogs: {
      base: 'api/system-logs',
      getAllPageable: 'api/system-logs/page',
      users: 'api/system-logs/users',
      operations: 'api/system-logs/operations',
      dates: 'api/system-logs/dates'
    },
    myaccount: {
      base: 'api/my-account',
      changePassword: 'api/my-account/update-password'
    },
    systemConfiguration: {
      availableServices: {
        base: 'api/system-configuration/services',
        getAllPageable: 'api/system-configuration/services/page',
        getAllStandardPageable: 'api/system-configuration/services/standard/page'
      },
      provisioning: {
        base: 'api/system-configuration/provisioning',
        getAllPageable: 'api/system-configuration/provisioning/page',
        getAllStandardPageable: 'api/system-configuration/provisioning/standard/page'
      }
    },
    events: {
      base: 'api/events',
      all: 'api/events/page',
      apikey: 'api/events/apikey',
      event: 'api/events/event',
      service: 'api/events/service',
      dates: 'api/events/dates'
    }
  }
}
