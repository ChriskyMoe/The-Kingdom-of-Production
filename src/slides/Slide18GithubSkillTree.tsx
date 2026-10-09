import { SlideLayout } from '../components/SlideLayout'
import { SkillTree } from '../components/SkillTree'
import { GITHUB_TREE } from '../data/skillTree'

export default function Slide18GithubSkillTree() {
  return (
    <SlideLayout title="Everything GitHub can do" lead="Six skill branches. Badges show what is GA, preview or plan-dependent." badge="Click to unlock">
      <SkillTree branches={GITHUB_TREE} />
    </SlideLayout>
  )
}
