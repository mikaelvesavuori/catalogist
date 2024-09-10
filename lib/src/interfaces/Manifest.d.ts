export interface Manifest {
    spec: Spec;
    relations?: Relations;
    support?: Support;
    api?: Api;
    slo?: Slo;
    links?: Links;
    metadata?: Metadata;
    timestamp?: string | number;
}
type Spec = {
    repo: string;
    name: string;
    description: string;
    kind?: Kind;
    lifecycleStage?: string;
    version?: string;
    responsible?: string;
    team?: string;
    system?: string;
    domain?: string;
    dataSensitivity?: DataSensitivity;
    tags?: string[];
};
type Kind = 'service' | 'api' | 'component' | 'cots' | 'product' | 'external' | 'other';
type DataSensitivity = 'public' | 'internal' | 'secret' | 'other';
type Relations = string[];
type Support = {
    [SupportData: string]: string | number;
};
type Slo = SloItem[];
export type SloItem = {
    description: string;
    type: SloType;
    implementation?: string;
    target: string;
    period: number;
};
type SloType = 'latency' | 'availability' | 'correctness' | 'other';
type Api = ApiItem[];
type ApiItem = {
    name: string;
    schemaPath?: string;
};
type Metadata = {
    [MetadataKey: string]: string;
};
type Links = LinkItem[];
export type LinkItem = {
    url: string;
    title: string;
    icon?: Icon;
};
type Icon = 'web' | 'api' | 'service' | 'documentation' | 'task' | 'dashboard' | 'other';
export {};
