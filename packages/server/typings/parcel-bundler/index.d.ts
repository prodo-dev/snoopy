import * as stream from "stream";

declare module "parcel-bundler" {
  abstract class Packager<T> {
    dest: stream.Writable;
    start(): Promise<void>;
    abstract addAsset(asset: T): Promise<void>;
    end(): Promise<void>;
  }

  export type Asset = any;
  export var Asset: any;
}
