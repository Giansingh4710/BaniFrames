/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        amrlipiheavyregular: ["AmrLipiHeavyRegular"],
        anmollipiregular: ["AnmolLipiRegular"],
        choti: ["Choti"],
        adhiapakblack: ["Adhiapakblack"],
        adhiapakbold: ["AdhiapakBold"],
        adhiapakchiselblack: ["AdhiapakChiselBlack"],
        adhiapakbook: ["AdhiapakBook"],
        adhiapakmedium: ["AdhiapakMedium"],
        adhiapaklight: ["AdhiapakLight"],
        adhiapakextralight: ["AdhiapakExtraLight"],
      },
      height: {
        "9/10": "90%",
        "1/10": "10%",
      },
    },
  },
  plugins: [],
};
