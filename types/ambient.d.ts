declare module "vite/client" {
  export interface ImportMetaEnv {
    [key: string]: string | undefined;
  }
  export interface ImportMeta {
    env: ImportMetaEnv;
  }
}

declare module "*.png" {
  const value: string;
  export default value;
}
