/**
 * @description The Manifest is the container of your solution information.
 */
export interface Manifest {
  spec: Spec;
  relations?: Relations;
  support?: Support;
  api?: Api;
  slo?: Slo;
  links?: Links;
  metadata?: Metadata;
  timestamp?: string | number; // Timestamp value is generated when the manifest is persisted
}

/**
 * @description Fundamental information about your solution.
 */
type Spec = {
  serviceName: string;
  serviceType?: ServiceType;
  lifecycleStage?: LifecycleStage;
  version?: string;
  description?: string;
  responsible?: string;
  team?: Team;
  system?: System;
  domain?: Domain;
  dataSensitivity?: DataSensitivity;
  tags?: string[];
};

/**
 * @description Describes which type of solution this is.
 */
type ServiceType = 'custom' | 'cots' | 'product' | 'external';

/**
 * @description Describes which stage of the lifecycle this solution is in. Defaults to "production".
 */
type LifecycleStage = string;

/**
 * @description The team that owns this solution.
 */
type Team = string;

/**
 * @description The system this solution is part of.
 */
type System = string;

/**
 * @description The domain this solution/system is part of.
 */
type Domain = string;

/**
 * @description The overall data sensitivity of your solution.
 */
type DataSensitivity = 'Public' | 'Internal' | 'Confidential';

/**
 * @description Relations (named) that this solution may have to other relations.
 */
type Relations = {
  [RelationName: string]: string;
};

/**
 * @description Support information for your solution.
 */
type Support = {
  [SupportData: string]: string;
};

/**
 * @description Array of SLO items. Max 10 items allowed.
 */
type Slo = SloItem[];

/**
 * @description Service level objective (SLO) information.
 */
type SloItem = {
  description: string;
  level?: string;
  percentile?: Percentile;
  maxLatency?: number;
};

/**
 * @description Percentile units.
 */
type Percentile = 'p50' | 'p75' | 'p90' | 'p95' | 'p99';

/**
 * @description Array of API items. Max 10 items allowed.
 */
type Api = ApiItem[];

/**
 * @description The name of any API connected to this solution. The value should ideally point to a (local or remote) schema or definition.
 */
type ApiItem = {
  [ApiName: string]: string;
};

/**
 * @description Any optional metadata.
 */
type Metadata = {
  [MetadataKey: string]: string;
};

/**
 * @description Array of Link items. Max 10 items allowed.
 */
type Links = LinkItem[];

/**
 * @description Link to external resources.
 */
type LinkItem = {
  title: string;
  url: string;
  icon: Icon;
};

/**
 * @description The type of icon that should represent this resource.
 */
type Icon = 'documentation' | 'backlog' | 'dashboard' | 'recovery';
