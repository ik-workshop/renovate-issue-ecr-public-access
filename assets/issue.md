You can find [Minimal Reproduction repository here](https://github.com/ik-workshop/renovate-issue-ecr-public-access)

According to this [issue](https://github.com/renovatebot/renovate/issues/9268), []Amazon ECR Public Galery](https://gallery.ecr.aws/?page=1) should be fully supported.

Amazon Public galery does not require any credentials or authentication. Example how I can access public gallery with cli

```sh
$ TOKEN=$(curl -k https://public.ecr.aws/token/ | jq -r '.token')
$ curl -k -H "Authorization: Bearer $TOKEN" https://public.ecr.aws/v2/amazonlinux/amazonlinux/tags/list | jq . | head
```

or

```sh
skopeo list-tags --no-creds docker://public.ecr.aws/aws-ec2/helm/aws-node-termination-handler
```

However, Renovate is not capable to identify correct updates. For some reason, they appear to be empty. Documentation does not specify how to access
`public.ecr.aws`, this mainly due to fact, that this access not require any credentials.

In the example repository `public.ecr.aws/aws-ec2/helm/aws-node-termination-handler` should have single version `0.22.0`, in debug logs, it's visible, that the correct version is identified

```log
DEBUG: manifest blob response body missing the "config" property (repository=ik-workshop/renovate-issue-ecr-public-access, baseBranch=main)
       "headers": {
         "content-type": "application/octet-stream",
         "content-length": "712",
         "connection": "close",
         "date": "Fri, 11 Aug 2023 17:59:23 GMT",
         "last-modified": "Wed, 21 Jun 2023 22:51:24 GMT",
         "etag": "\"b788aaf9871cbdfd48381599c2b171b0-1\"",
         "x-amz-server-side-encryption": "AES256",
         "x-amz-version-id": "PG1mTfHM_6OeOuIet0SqDYkNPLXy5xdr",
         "accept-ranges": "bytes",
         "server": "AmazonS3",
         "x-cache": "Hit from cloudfront",
         "via": "1.1 c6c27fb3a8bc413f99e81981948a67c6.cloudfront.net (CloudFront)",
         "x-amz-cf-pop": "MAN50-C1",
         "x-amz-cf-id": "xGT_BTK_ChlaNyq1_XDj2iTcF_XYnWQrjZntMnBRLhaCLPSFnEdSjQ==",
         "age": "57230"
       },
       "body": {
         "name": "aws-node-termination-handler",
         "home": "https://github.com/aws/aws-node-termination-handler/",
         "sources": ["https://github.com/aws/aws-node-termination-handler/"],
         "version": "0.22.0",
         "description": "A Helm chart for the AWS Node Termination Handler.",
         "keywords": ["aws", "eks", "ec2", "node-termination", "spot"],
         "maintainers": [
           {
             "name": "Brandon Wagner",
             "email": "bwagner5@users.noreply.github.com",
             "url": "https://github.com/bwagner5"
           },
           {
             "name": "Jillian Kuentz",
             "email": "jillmon@users.noreply.github.com",
             "url": "https://github.com/jillmon"
           }
         ],
         "icon": "https://raw.githubusercontent.com/aws/eks-charts/master/docs/logo/aws.png",
         "apiVersion": "v2",
         "appVersion": "1.20.0",
         "kubeVersion": ">= 1.16-0",
         "type": "application"
       }
```

But for some reason, version is not updated

```json
"helmv3": [
  {
    "deps": [
      {
        "depName": "aws-node-termination-handler",
        "currentValue": "11.14.4",
        "datasource": "docker",
        "packageName": "public.ecr.aws/aws-ec2/helm/aws-node-termination-handler",
        "updates": ["++++THIS SHOULD HAVE a VERSION 0.22.0++++"],
        "versioning": "docker",
        "warnings": [],
        "registryUrl": "https://public.ecr.aws",
        "currentVersion": "11.14.4",
        "fixedVersion": "11.14.4"
      }
    ],
    "datasource": "helm",
    "packageFileVersion": "1.0.0",
    "packageFile": "examples/oci-ecr/Chart.yml"
  }
]
```

Same for another docker image `public.ecr.aws/eks-distro/kubernetes-csi/livenessprobe`

The result is
```json
"helm-values": [
{
  "deps": [
    {
      "depName": "public.ecr.aws/eks-distro/kubernetes-csi/livenessprobe",
      "currentValue": "v2.7.0-eks-1-21-16",
      "datasource": "docker",
      "replaceString": "v2.7.0-eks-1-21-16",
      "versioning": "docker",
      "autoReplaceStringTemplate": "{{newValue}}{{#if newDigest}}@{{newDigest}}{{/if}}",
      "updates": [],
      "packageName": "public.ecr.aws/eks-distro/kubernetes-csi/livenessprobe",
      "warnings": [],
      "registryUrl": "https://public.ecr.aws",
      "currentVersion": "v2.7.0",
      "fixedVersion": "v2.7.0-eks-1-21-16"
    }
  ],
  "packageFile": "examples/values.yaml"
}
```

Looks, like Renovate is not able to identify, that there are never version

```
"v2.6.0-eks-1-20-12",
"v2.6.0-eks-1-20-13",
"v2.8.0-eks-1-21-22",
"v2.10.0-eks-1-27-5",
"v2.6.0-eks-1-20-14",
"v2.7.0-eks-1-21-16",
"v2.9.0-eks-1-26-5",
```


Expected result
- All versions updated
