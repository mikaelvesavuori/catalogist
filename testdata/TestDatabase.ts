/**
 * @description Records in "someotherlifecycle" lifecycleStage
 */
export const dataSomeotherLifecycle: any = [
  {
    spec: {
      serviceType: 'service',
      lifecycleStage: 'someotherlifecycle',
      description: 'My service',
      serviceName: 'my-service',
      team: 'ThatAwesomeTeam',
      responsible: 'Someguy Someguyson',
      system: 'some-system',
      domain: 'some-domain',
      tags: ['typescript', 'backend'],
      dataSensitivity: 'Public',
      version: '1.0.0'
    },
    relations: ['my-other-service'],
    support: {
      resolverGroup: 'ThatAwesomeTeam'
    },
    slo: [
      {
        description: 'Max latency must be 350ms for the 90th percentile',
        level: '99.9',
        percentile: 'p90',
        maxLatency: 350
      }
    ],
    api: [
      {
        MyProjectApi: './api/schema.yml'
      }
    ],
    metadata: {},
    links: [
      {
        url: 'https://my-confluence.atlassian.net/wiki/spaces/DEV/pages/123456789/',
        title: 'Confluence documentation',
        icon: 'documentation'
      }
    ]
  },
  {
    spec: {
      serviceType: 'service',
      lifecycleStage: 'production',
      description: 'My other service',
      serviceName: 'my-other-service',
      team: 'ThatAwesomeTeam',
      responsible: 'Someguy Someguyson',
      system: 'some-system',
      domain: 'some-domain',
      tags: ['typescript', 'backend'],
      dataSensitivity: 'Public',
      version: '1.0.0'
    },
    relations: ['my-service'],
    support: {
      resolverGroup: 'ThatAwesomeTeam'
    },
    slo: [
      {
        description: 'Max latency must be 350ms for the 90th percentile',
        level: '99.9',
        percentile: 'p90',
        maxLatency: 350
      }
    ],
    api: [
      {
        MyProjectApi: './api/schema.yml'
      }
    ],
    metadata: {
      arkitOutputFolder: './diagrams/',
      sbomOutputFile: './sbom-output.txt',
      typedocOutputFolder: './typedoc-docs/'
    },
    links: [
      {
        url: 'https://my-confluence.atlassian.net/wiki/spaces/DEV/pages/123456789/',
        title: 'Confluence documentation',
        icon: 'documentation'
      }
    ]
  }
];

/**
 * @description Records in "production" lifecycleStage
 */
export const dataProduction: any = [
  {
    spec: {
      type: 'service',
      lifecycleStage: 'production',
      description: 'My other service',
      serviceName: 'my-other-service',
      team: 'ThatAwesomeTeam',
      responsible: 'Someguy Someguyson',
      system: 'some-system',
      domain: 'some-domain',
      tags: ['typescript', 'backend'],
      dataSensitivity: 'Public',
      version: '1.0.0'
    },
    relations: ['my-service'],
    support: {
      resolverGroup: 'ThatAwesomeTeam'
    },
    slo: [
      {
        description: 'Max latency must be 350ms for the 90th percentile',
        level: '99.9',
        percentile: 'p90',
        maxLatency: 350
      }
    ],
    api: [
      {
        MyProjectApi: './api/schema.yml'
      }
    ],
    metadata: {
      arkitOutputFolder: './diagrams/',
      sbomOutputFile: './sbom-output.txt',
      typedocOutputFolder: './typedoc-docs/'
    },
    links: [
      {
        url: 'https://my-confluence.atlassian.net/wiki/spaces/DEV/pages/123456789/',
        title: 'Confluence documentation',
        icon: 'documentation'
      }
    ]
  },
  {
    spec: {
      type: 'service',
      lifecycleStage: 'production',
      description: 'My service',
      serviceName: 'my-service',
      team: 'ThatAwesomeTeam',
      responsible: 'Someguy Someguyson',
      system: 'some-system',
      domain: 'some-domain',
      tags: ['typescript', 'backend'],
      dataSensitivity: 'Public',
      version: '1.0.0'
    },
    relations: ['my-other-service'],
    support: {
      resolverGroup: 'ThatAwesomeTeam'
    },
    slo: [
      {
        description: 'Max latency must be 350ms for the 90th percentile',
        level: '99.9',
        percentile: 'p90',
        maxLatency: 350
      }
    ],
    api: [
      {
        MyProjectApi: './api/schema.yml'
      }
    ],
    metadata: {
      arkitOutputFolder: './diagrams/',
      sbomOutputFile: './sbom-output.txt',
      typedocOutputFolder: './typedoc-docs/'
    },
    links: [
      {
        url: 'https://my-confluence.atlassian.net/wiki/spaces/DEV/pages/123456789/',
        title: 'Confluence documentation',
        icon: 'documentation'
      }
    ]
  }
];
