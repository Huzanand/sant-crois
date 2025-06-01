import localFont from "next/font/local";

const eUkraine = localFont({
    src: [
        {
            path: './e-Ukraine-Thin.otf',
            weight: '100'
        },
        {
            path: './e-Ukraine-UltraLight.otf',
            weight: '200'
        },
        {
            path: './e-Ukraine-Light.otf',
            weight: '300'
        },
        {
            path: './e-Ukraine-Regular.otf',
            weight: '400'
        },
        {
            path: './e-Ukraine-Medium.otf',
            weight: '500'
        },
        {
            path: './e-Ukraine-Bold.otf',
            weight: '700'
        }
    ],
    variable: "--e-Ukraine"
})

export default eUkraine;