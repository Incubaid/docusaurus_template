

editor can be used at 

https://niolesk.top/#https://kroki.io/rackdiag/svg/eNorSkzOTslMTFeo5lJQMDQLtQZRVgqhAcEK0UahsSCusZWCi5NCcGpRWWoRiG9ipRCemoQkYIouYIYuYG6l4JOfmKLglJiTmJcMEbMAihkrBJdnliRnWHPVAgDhXSWB

## in a markdown

Not much flexibility in using in html tags (e.g. no multi columns, no maxwidth)

```
---
title: Draw
sidebar_position: 2
---


\`\`\`kroki type=plantuml
@startuml
!theme bluegray
skinparam backgroundColor transparent
skinparam shadowing false
skinparam componentStyle rectangle

skinparam defaultFontColor #CCCCCC
skinparam ArrowColor #CCCCCC

skinparam package {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #111111
}
skinparam node {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #444444
}
skinparam component {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #333333
}
skinparam entity {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #222222
}
skinparam actor {
  FontColor #CCCCCC
}

actor User
package "Secure Sandbox (User-side)" {
  component QSFS as "QSFS"
  component ZeroStor as "Zero-STOR"
}

package "Farmer Nodes" {
  node Node1 as "Node A (Zero-OS)" {
    component ZDB1 as "ZDB A"
  }
  node Node2 as "Node B (Zero-OS)" {
    component ZDB2 as "ZDB B"
  }
  node Node3 as "Node C (Zero-OS)" {
    component ZDB3 as "ZDB C"
  }
}

entity Blockchain
entity Validator

User --> QSFS : Request to store/retrieve file
QSFS --> ZeroStor : Read/write fragments

ZeroStor --> ZDB1 : Store/verify fragment
ZeroStor --> ZDB2 : Store/verify fragment
ZeroStor --> ZDB3 : Store/verify fragment

ZeroStor --> Blockchain : Report storage proofs
Validator --> Blockchain : Trigger audits
Validator --> ZDB1 : Run audit workloads
Validator --> Blockchain : Update reputation

@enduml

\`\`\`
```

## a nice architecture one using .mdx

make sure file name ends with .mdx

see the optional maxWidth


```tsx
---
title: Draw
sidebar_position: 2
---

import { Kroki } from '@site/src/components/Kroki';

<Kroki type="plantuml"  maxWidth={1000}>
{`
@startuml
!theme bluegray
skinparam backgroundColor transparent
skinparam shadowing false
skinparam componentStyle rectangle

skinparam defaultFontColor #CCCCCC
skinparam ArrowColor #CCCCCC

skinparam package {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #111111
}
skinparam node {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #444444
}
skinparam component {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #333333
}
skinparam entity {
  FontColor #CCCCCC
  BorderColor #CCCCCC
  BackgroundColor #222222
}
skinparam actor {
  FontColor #CCCCCC
}

actor User
package "Secure Sandbox (User-side)" {
  component QSFS as "QSFS"
  component ZeroStor as "Zero-STOR"
}

package "Farmer Nodes" {
  node Node1 as "Node A (Zero-OS)" {
    component ZDB1 as "ZDB A"
  }
  node Node2 as "Node B (Zero-OS)" {
    component ZDB2 as "ZDB B"
  }
  node Node3 as "Node C (Zero-OS)" {
    component ZDB3 as "ZDB C"
  }
}

entity Blockchain
entity Validator

User --> QSFS : Request to store/retrieve file
QSFS --> ZeroStor : Read/write fragments

ZeroStor --> ZDB1 : Store/verify fragment
ZeroStor --> ZDB2 : Store/verify fragment
ZeroStor --> ZDB3 : Store/verify fragment

ZeroStor --> Blockchain : Report storage proofs
Validator --> Blockchain : Trigger audits
Validator --> ZDB1 : Run audit workloads
Validator --> Blockchain : Update reputation

@enduml

`}
</Kroki>

```

## 2 column possibility

```tsx
---
title: Draw3
sidebar_position: 3
---
import { Kroki } from '@site/src/components/Kroki';

<div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

<div style={{ width: "300px" }}>

<Kroki type="rackdiag" >
{`
rackdiag {
  16U;
  1: UPS [2U];
  3: DB Server;
  4: Web Server;
  5: Web Server;
  6: Web Server;
  7: Load Balancer;
  8: L3 Switch;
}
`}
</Kroki>

</div>

<div style={{ flex: '1' }}> 

This rack setup represents a typical web infrastructure layout. 

- The **UPS** unit ensures power reliability. 
- The **DB Server** handles all data storage and queries. 
- Multiple **Web Servers** provide load-balanced services. - A **Load Balancer** manages traffic across servers. 
- An **L3 Switch** connects everything together with VLANs and routing. 

</div> 

</div>
```