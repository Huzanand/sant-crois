```text
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── fly.toml
├── next-env.d.ts
├── next.config.js
├── npm
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── screenshots
│       ├── constructor.png
│       ├── lesson-library.png
│       ├── lesson.png
│       └── virtual-room.png
├── src
│   ├── api
│   │   └── api.ts
│   ├── app
│   │   ├── [locale]
│   │   │   ├── about
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── contacts
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── cookie
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── faq
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── privacy
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── team
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   └── terms-of-use
│   │   │       ├── page.module.css
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   └── rooms
│   │   │       └── [roomId]
│   │   │           ├── answers
│   │   │           │   └── route.ts
│   │   │           └── route.ts
│   │   ├── client-layout.tsx
│   │   ├── layout.tsx
│   │   ├── lesson
│   │   │   └── [lessonId]
│   │   │       ├── @modal
│   │   │       │   ├── (.)modal
│   │   │       │   │   ├── page.module.css
│   │   │       │   │   └── page.tsx
│   │   │       │   └── default.tsx
│   │   │       ├── layout.tsx
│   │   │       ├── modal
│   │   │       │   ├── page.module.css
│   │   │       │   └── page.tsx
│   │   │       ├── page.module.css
│   │   │       ├── page.tsx
│   │   │       └── results
│   │   │           ├── page.module.css
│   │   │           └── page.tsx
│   │   ├── page.module.css
│   │   ├── page.tsx
│   │   ├── rooms
│   │   │   └── [roomId]
│   │   │       ├── page.module.css
│   │   │       ├── page.tsx
│   │   │       └── results
│   │   │           ├── page.module.css
│   │   │           └── page.tsx
│   │   └── server-layout.tsx
│   ├── assets
│   │   ├── animations
│   │   │   ├── burger.json
│   │   │   └── loader.json
│   │   ├── backgroundMain.png
│   │   ├── coming soon.png
│   │   ├── declaration.d.ts
│   │   ├── developers
│   │   │   ├── DidenkoO.png
│   │   │   ├── DomkinO.png
│   │   │   ├── IhnatovaK.png
│   │   │   ├── Ivan.png
│   │   │   ├── LatyshevA.png
│   │   │   ├── LatyshevaK.png
│   │   │   └── ZlobinE.png
│   │   ├── fonts
│   │   │   ├── e-Ukraine-Bold.otf
│   │   │   ├── e-Ukraine-Light.otf
│   │   │   ├── e-Ukraine-Medium.otf
│   │   │   ├── e-Ukraine-Regular.otf
│   │   │   ├── e-Ukraine-Thin.otf
│   │   │   ├── e-Ukraine-UltraLight.otf
│   │   │   └── index.ts
│   │   ├── footer
│   │   │   ├── BG 1024.png
│   │   │   ├── BG 1440.png
│   │   │   ├── BG 1920.png
│   │   │   ├── BG 2560.png
│   │   │   ├── BG 360.png
│   │   │   ├── BG 600.png
│   │   │   └── BG 965.png
│   │   ├── logoBottom.svg
│   │   ├── logoTop.svg
│   │   ├── maskot_not_found.png
│   │   ├── popup_L.png
│   │   ├── popup_S.png
│   │   └── svg
│   │       ├── arrow-down.svg
│   │       ├── footer.svg
│   │       └── icons.tsx
│   ├── components
│   │   ├── ageFilter
│   │   │   ├── AgeFilter.tsx
│   │   │   └── ageFilter.module.css
│   │   ├── appSidebar
│   │   │   ├── AppSideBar.tsx
│   │   │   └── appSideBar.module.css
│   │   ├── burgerMenu
│   │   │   ├── BurgerMenu.tsx
│   │   │   ├── HomePageView.tsx
│   │   │   ├── LessonPageView.tsx
│   │   │   └── burgerMenu.module.css
│   │   ├── card
│   │   │   ├── Card.tsx
│   │   │   └── card.module.css
│   │   ├── checkAnswers
│   │   │   ├── multipleCheck
│   │   │   │   ├── MultipleCheck.tsx
│   │   │   │   └── multipleCheck.module.css
│   │   │   └── singleCheck
│   │   │       ├── SingleCheck.tsx
│   │   │       └── singleCheck.module.css
│   │   ├── divider
│   │   │   └── Divider.tsx
│   │   ├── error404
│   │   │   ├── Error404.tsx
│   │   │   └── error404.module.css
│   │   ├── fillTextSelect
│   │   │   ├── FillTextSelect.tsx
│   │   │   └── fillTextSelect.module.css
│   │   ├── filters
│   │   │   ├── Filters.tsx
│   │   │   └── filters.module.css
│   │   ├── footer
│   │   │   ├── Footer.tsx
│   │   │   └── footer.module.css
│   │   ├── inDev
│   │   │   ├── InDev.tsx
│   │   │   └── inDev.module.css
│   │   ├── lessonInfo
│   │   │   ├── DefaultViev.tsx
│   │   │   ├── LessonInfo.tsx
│   │   │   ├── MobileViev.tsx
│   │   │   └── lessonInfo.module.css
│   │   ├── loader
│   │   │   ├── Loader.tsx
│   │   │   └── loader.module.css
│   │   ├── logo
│   │   │   ├── Logo.tsx
│   │   │   └── logo.module.css
│   │   ├── modalMod
│   │   │   ├── ModalMod.tsx
│   │   │   └── modalMob.module.css
│   │   ├── pagination
│   │   │   ├── Pagination.tsx
│   │   │   └── pagination.module.css
│   │   ├── progressbar
│   │   │   ├── ProgressBar.tsx
│   │   │   └── progressBar.module.css
│   │   ├── rating
│   │   │   ├── Rating.tsx
│   │   │   └── rating.module.css
│   │   ├── recomendations
│   │   │   ├── Recomandations.tsx
│   │   │   └── recomendations.module.css
│   │   ├── roomInfo
│   │   │   ├── DefaultViev.tsx
│   │   │   ├── MobileViev.tsx
│   │   │   ├── RoomInfo.tsx
│   │   │   ├── TransformKeepAliveTime.tsx
│   │   │   └── roomInfo.module.css
│   │   ├── searchComponent
│   │   │   ├── SearchComponent.tsx
│   │   │   └── searchComponent.module.css
│   │   ├── settings
│   │   │   ├── Settings.tsx
│   │   │   └── settings.module.css
│   │   ├── settingsSelect
│   │   │   ├── DropdawnVievAbsolute.tsx
│   │   │   ├── DropdawnVievDefault.tsx
│   │   │   ├── DropdawnVievModal.tsx
│   │   │   ├── SettingsSelect.tsx
│   │   │   ├── models.ts
│   │   │   ├── resultsHeader
│   │   │   │   ├── ResultsHeader.tsx
│   │   │   │   └── resultsHeader.module.css
│   │   │   └── settingsSelect.module.css
│   │   ├── skeleton
│   │   │   └── Skeleton.tsx
│   │   ├── tasks
│   │   │   ├── choose
│   │   │   │   ├── ChooseTask.tsx
│   │   │   │   └── chooseTask.module.css
│   │   │   ├── fillText
│   │   │   │   ├── FillTextTask.tsx
│   │   │   │   └── fillTextTask.module.css
│   │   │   ├── media
│   │   │   │   ├── MediaTask.tsx
│   │   │   │   └── mediaTask.module.css
│   │   │   ├── text
│   │   │   │   └── TextTask.tsx
│   │   │   ├── trueFalse
│   │   │   │   ├── TrueFalse.tsx
│   │   │   │   └── trueFalseTask.module.css
│   │   │   └── write
│   │   │       ├── WriteTask.tsx
│   │   │       └── writeTask.module.css
│   │   ├── tooltip
│   │   │   ├── Tooltip.tsx
│   │   │   └── tooltip.module.css
│   │   └── typeOfLesson
│   │       ├── TypeOfLesson.tsx
│   │       └── typeOfLesson.module.css
│   ├── i18n
│   │   ├── i18n.ts
│   │   └── i18nWrapper.tsx
│   ├── locales
│   │   ├── English.json
│   │   ├── French.json
│   │   ├── German.json
│   │   ├── Ukrainian.json
│   │   └── locales.d.ts
│   ├── models
│   │   ├── index.ts
│   │   └── interceptorsStore.ts
│   ├── store
│   │   ├── interceptorsStore.ts
│   │   ├── localStorageUtils.ts
│   │   ├── store.ts
│   │   └── storeProvider.tsx
│   ├── styles
│   │   └── globals.css
│   └── utils
│       ├── RenderTasks.tsx
│       ├── TrankateText.ts
│       ├── getServerTranslations.ts
│       ├── keyManager.ts
│       ├── makeFirstLetterUppercase.ts
│       ├── renderHeaderOfLesson
│       │   ├── RenderHeaderOfLesson.tsx
│       │   └── page.module.css
│       ├── separatedText.tsx
│       ├── useFilterParam.ts
│       ├── useLanguage.tsx
│       ├── useMobile.tsx
│       ├── useTranslatedOptions.tsx
│       └── useWindowWidth.ts
├── tsconfig.json
└── tsconfig.tsbuildinfo

77 directories, 189 files
```
