import { Language } from "@/lib/models/Code"

// Type Imports
type LanguageDataType ={
  value: string,
  text: string,
}

const languageData = (): LanguageDataType[] => [
  {
    value: Language.JAVA,
    text: "Java"
  },
  {
    value: Language.JAVASCRIPT,
    text: "JavaScript"
  },
  {
    value: Language.PYTHON,
    text: "Python"
  },
  {
    value: Language.PHP,
    text: "PHP"
  },
]

export default languageData
