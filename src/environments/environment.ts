export const environment = {

  production: false,
  appTitle: 'HAFAS API Manager',
  clientId: 'HAFAS Standard',

  basePath: 'http://localhost:8080/manager/',
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
      },
      messages: {
        base: 'api/system-configuration/messages',
        email: 'api/system-configuration/messages/email',
        quota: 'api/system-configuration/messages/quota',
        softQuota: 'api/system-configuration/messages/soft-quota',
        hardQuota: 'api/system-configuration/messages/hard-quota',
        languages: 'api/system-configuration/messages/languages'
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

