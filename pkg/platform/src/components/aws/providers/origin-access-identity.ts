import { CustomResourceOptions, dynamic } from "@pulumi/pulumi";
import { awsFetch } from "../helpers/client.js";

interface Inputs {}

interface Outputs {}

export interface OriginAccessIdentityInputs {}

export interface OriginAccessIdentity {}

class Provider implements dynamic.ResourceProvider {
  async create(inputs: Inputs): Promise<dynamic.CreateResult<Outputs>> {
    const ret = await awsFetch(
      "cloudfront",
      "/origin-access-identity/cloudfront",
      {
        method: "post",
        body: [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<CloudFrontOriginAccessIdentityConfig xmlns="http://cloudfront.amazonaws.com/doc/2020-05-31/">`,
          `   <CallerReference>${Date.now().toString()}</CallerReference>`,
          `   <Comment>Created by SST</Comment>`,
          `</CloudFrontOriginAccessIdentityConfig>`,
        ].join("\n"),
      },
    );
    const id = ret.Id!;

    return { id, outs: {} };
  }

  async delete(id: string, outs: Outputs): Promise<void> {
    const ret = await awsFetch(
      "cloudfront",
      `/origin-access-identity/cloudfront/${id}`,
      { method: "get" },
    );

    await awsFetch("cloudfront", `/origin-access-identity/cloudfront/${id}`, {
      method: "delete",
      headers: {
        IfMatch: ret.ETag,
      },
    });
  }
}

export class OriginAccessIdentity extends dynamic.Resource {
  constructor(
    name: string,
    args: OriginAccessIdentityInputs,
    opts?: CustomResourceOptions,
  ) {
    super(new Provider(), `${name}.sst.aws.OriginAccessIdentity`, args, opts);
  }
}
