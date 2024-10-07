# 📼 You-Together 친구와 함께 Youtube 시청

## Overview

#### 🔗 [배포 링크](https://you-together.site)

#### 🔗 [API 문서 링크](https://api.you-together.site/docs/index.html)

### 🙌 서비스 소개

- 친구와 채팅하며 Youtube 영상을 함께 시청하는 서비스입니다.
- 재생시간 동기화를 통해 Youtube 영상의 같은 구간을 함께 시청하는 것이 특징인 서비스입니다.

### 🤝 팀원 구성

👩‍💻 BE: [Hyun](https://github.com/ghkdgus29), [Fia](https://github.com/yeonise)<br>
👨‍💻 FE: [poco](https://github.com/poco111)

### 기술 스택

Frontend: React, TypeScript, Next.js, Tailwind CSS

### 작업 관리

주 3회 정기 회의를 통해 작업 순서 및 방향성에 대해 고민을 나누고 작업 내용을 공유하여 [회의록](https://jamstorage.notion.site/4816874618ea42cd93662c86644ac86d?pvs=4) 작성

---

## 주요기능

### 💬 실시간 채팅

- 웹 소켓을 사용하여 실시간 채팅을 통해 YouTube 영상을 주제로 소통하거나, 다양한 주제에 대해 자유롭게 대화할 수 있습니다.

![실시간 채팅](https://github.com/user-attachments/assets/3971ae81-9c1e-49d0-b471-814db00070f1)

### ⏱️ 재생시간 동기화

- 재싱시간 동기화를 통해 같은 방에 있는 사용자는 동일한 시간대의 youtube 영상을 시청할 수 있습니다.

![영상싱크 수정(용량 수정)](https://github.com/user-attachments/assets/7892fa10-fa7a-4fc0-b6ab-9a7773001b37)

### 방(공개방, 비공개방) 생성 및 입장

- 사용자는 공개방 또는 비공개방을 생성할 수 있고 비공개방은 올바른 비밀번호를 입력해야 입장할 수 있습니다.

![방 생성 및 입장](https://github.com/user-attachments/assets/c088e0d8-5962-427f-9202-400daa2bd30d)

### ⌨️ 방 제목 검색

- 특수문자를 제외한 원하는 키워드가 포함된 방을 검색할 수 있습니다.

![방 제목 검색](https://github.com/user-attachments/assets/f686e905-6db5-445c-8838-2d144a526de9)

### 📼 재생목록 추가, 삭제 및 순서 수정

- 재생목록에 새로운 youtube 영상을 추가하거나 기존 영상을 삭제할 수 있습니다.

- 재생목록에 있는 youtube 영상의 재생순서를 수정할 수 있습니다.

![재생목록 추가, 제거 및 수정](https://github.com/user-attachments/assets/62c25196-63cb-4d30-8631-b21c1c39ccd8)

### 닉네임 변경

- 사용자의 입력값에 대해 즉시 유효성 및 중복 검사를 진행한 후 검사를 통과하면 닉네임을 변경할 수 있습니다.

![닉네임 변경](https://github.com/user-attachments/assets/6837561c-e5b5-4127-b083-e8cd68e1b087)

### 다른 사용자의 권한 변경

- MANAGER 이상 권한을 가진 사용자는 다른 사용자의 권한을 변경할 수 있습니다.

![다른 사용자 권한 변경](https://github.com/user-attachments/assets/6762f239-52cc-454e-9c4e-eecb914c3d5d)

### 💪 사용자 권한에 따른 기능 구분

**HOST** : 방 제목 변경 권한을 가지며, MANAGER 권한의 모든 기능을 수행할 수 있습니다.

**MANAGER** : 다른 사용자의 권한을 변경할 수 있으며, EDITOR 권한의 모든 기능을 수행할 수 있습니다.

**EDITOR** : 재생목록 관리 및 영상 싱크 조정이 가능하며, GUEST 권한의 모든 기능을 수행할 수 있습니다.

**GUEST** :채팅이 가능하며, VIEWER 권한의 모든 기능을 수행할 수 있습니다.

**VIEWER** : 영상 시청만 가능합니다.

**모든 사용자** : 닉네임 변경

- 해당 기능에 대한 권한이 없는 사용자의 경우, 알림을 통해 사용자에게 해당 기능에 대한 권한이 없음을 알려줍니다.

  - 예를들어, 영상 싱크 조정이 불가능한 사용자의 경우에는 권한이 없다는 알림과 함께 영상 싱크는 이전과 동일하게 유지됩니다.
