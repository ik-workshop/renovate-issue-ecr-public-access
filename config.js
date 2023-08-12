const Fs = require('fs');

module.exports = {
  "platform": "github",
  "token": process.env.RENOVATE_TOKEN,
  "repositories": JSON.parse(Fs.readFileSync('repos.json', 'utf8')),
  "logLevel": process.env.LOG_LEVEL,
  "gitAuthor": "Renovate Bot <bot@renovateapp.com>",
  "prConcurrentLimit": 0,
  "prHourlyLimit": 0,
  "pruneStaleBranches": true,
  "recreateWhen": "always",
  "onboarding": false,
  "requireConfig": "optional",
  "baseBranches": ["master", "main"],
  "enabledManagers": ["helmv3", "helm-values"],
  "packageRules": [
    // {
    //   "matchDatasources": ["docker"],
    //   "matchPackageNames": ["public.ecr.aws/eks-distro/kubernetes-csi/livenessprobe"],
    //   "versioning": "loose"
    // },
    {
      "matchDatasources": ["docker"],
      "matchPackageNames": ["public.ecr.aws/eks-distro/kubernetes-csi/livenessprobe"],
      "versioning": "regex:^v?(?<major>\\d+)\.(?<minor>\\d+)\.(?<patch>\\d+)-eks-\\d+-\\d+-\\d+$",
      // https://docs.renovatebot.com/configuration-options/#prbodydefinitions
      // not required, just playing with settings
      "prBodyDefinitions": {
        "Compatibility Guide": "[link](https://docs.aws.amazon.com/eks/latest/userguide/managing-coredns.html)",
        "Sources": "[link](https://github.com/coredns/coredns)",
        "Public Gallery": "[link](https://gallery.ecr.aws/eks-distro/coredns/coredns)"
      },
      "prBodyColumns": [
        "Package",
        "Update",
        "Change",
        "Compatibility Guide",
        "Sources",
        "Public Gallery"
      ]
    }
  ],
  "regexManagers": [],
  "hostRules": [
    // {
    //   "hostType": "docker",
    //   "matchHost": "public.ecr.aws"
    // },
    // {
    //   "hostType": "docker",
    //   "matchHost": "public.ecr.aws",
    //   "username": "AWS",
    //   "password": process.env.AWS_ECR_TOKEN
    // },
    // {
    //   "hostType": "docker",
    //   "matchHost": "public.ecr.aws",
    //   "username": process.env.AWS_ACCESS_KEY_ID,
    //   "encrypted": {
    //     "password": process.env.AWS_SECRET_ACCESS_KEY
    //   }
    // },
    // {
    //   "hostType": "docker",
    //   "matchHost": "public.ecr.aws",
    //   "username": process.env.AWS_ACCESS_KEY_ID,
    //   "password": process.env.AWS_SECRET_ACCESS_KEY
    // }
  ]
}