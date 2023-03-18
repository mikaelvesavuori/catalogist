/**
 * @description The Manifest is the container of your solution information.
 */
export interface Manifest {
  spec: Spec;

  // Optional
  relations?: Relations;
  support?: Support;
  api?: Api;
  slo?: Slo;
  links?: Links;
  metadata?: Metadata;

  // Timestamp value is generated when the manifest is persisted
  timestamp?: string | number;
}

/**
 * @description Fundamental information about your component.
 */
type Spec = {
  /**
   * @description Name of the repository where the code base is stored.
   * @example `someorg/somerepo` (GitHub format)
   */
  repo: string;
  /**
   * @description Name of the component.
   */
  name: string;
  /**
   * @description Describes the component.
   */
  description: string;

  // Optional
  kind?: Kind;
  /**
   * @description The lifecycle stage this component is in.
   * @example `prod`
   * @example `test`
   */
  lifecycleStage?: string;
  /**
   * @description The version of the component.
   * @example `1.0.0`
   */
  version?: string;
  /**
   * @description An individual that is responsible for this component.
   */
  responsible?: string;
  /**
   * @description The team responsible for this component.
   */
  team?: string;
  /**
   * @description The system this component is part of.
   */
  system?: string;
  /**
   * @description The domain this component is part of.
   */
  domain?: string;
  /**
   * @description The level of data sensitivity.
   */
  dataSensitivity?: DataSensitivity;
  /**
   * @description An optional list of tags.
   */
  tags?: string[];
};

/**
 * @description Describes which kind of component this is.
 */
type Kind = 'service' | 'api' | 'component' | 'cots' | 'product' | 'external' | 'other';

/**
 * @description The overall data sensitivity of your solution.
 */
type DataSensitivity = 'public' | 'internal' | 'secret' | 'other';

/**
 * @description Named relations this component has to other components.
 */
type Relations = string[];

/**
 * @description Support information for the component.
 */
type Support = {
  [SupportData: string]: string | number;
};

/**
 * @description Array of SLO items. Max 20 items allowed.
 */
type Slo = SloItem[];

/**
 * @description Service level objective (SLO) information.
 */
export type SloItem = {
  /**
   * @description Describes what the SLO does and measures.
   */
  description: string;
  /**
   * @description What type of SLO is this?
   */
  type: SloType;
  /**
   * @description Optional implementation query.
   * @example `(sum:trace.aws.lambda.hits.by_http_status{http.status_class:2xx AND service IN (demoservice-user,demoservice-greet)} by {service}.as_count() - sum:trace.aws.lambda.errors.by_http_status{http.status_class:5xx AND service IN (demoservice-user,demoservice-greet)} by {service}.as_count()) / (sum:trace.aws.lambda.hits{service IN (demoservice-user,demoservice-greet)} by {service}.as_count())`
   */
  implementation?: string;
  /**
   * @description Compliance target, typically described as a percentage, percentile, or duration.
   * @example `99.9%`
   * @example `p95`
   * @example `350ms`
   */
  target: string;
  /**
   * @description Compliance period in days.
   */
  period: number;
};

/**
 * @description What type of SLO is this?
 */
type SloType = 'latency' | 'availability' | 'correctness' | 'other';

/**
 * @description Array of API items. Max 10 items allowed.
 */
type Api = ApiItem[];

/**
 * @description The name of any API connected to this solution.
 * The value should ideally point to a (local or remote) schema or definition.
 */
type ApiItem = {
  /**
   * @description Name of the API.
   */
  name: string;
  /**
   * @description Path to a schema or definition of the API.
   */
  schemaPath?: string;
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
export type LinkItem = {
  /**
   * @description URL for the link.
   */
  url: string;
  /**
   * @description Title and description of the link.
   */
  title: string;
  icon?: Icon;
};

/**
 * @description The type of icon that should represent this resource.
 */
type Icon = 'web' | 'api' | 'service' | 'documentation' | 'task' | 'dashboard' | 'other';
