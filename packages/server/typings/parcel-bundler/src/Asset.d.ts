declare module "parcel-bundler/src/Asset" {
  class Asset {
    public id: string | null;
    public name: string;
    public basename: string;
    public relativeName: string;
    public options: any;
    public contents: string;
    public ast: any;
    public generated: any;
    public sourceMaps: boolean | null;

    public load(): Promise<string>;
    public parse(code: string): Promise<any>;
    public collectDependencies(): Promise<void>;
    public pretransform(): Promise<void>;
    public transform(): Promise<void>;
    public generate(): Promise<any>;
    public postProcess(generated: any): Promise<any>;
  }

  export = Asset;
}
