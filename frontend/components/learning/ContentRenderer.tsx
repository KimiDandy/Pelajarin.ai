// frontend/components/learning/ContentRenderer.tsx

import { InfoBox } from './content-blocks/InfoBox';
import { WarningBox } from './content-blocks/WarningBox';
import { SuccessBox } from './content-blocks/SuccessBox';
import { CodeBlock } from './content-blocks/CodeBlock';
import { TerminalBlock } from './content-blocks/TerminalBlock';
import { ChallengeBox } from './content-blocks/ChallengeBox';
import { TableBlock } from './content-blocks/TableBlock';
import { KeyTermsBox } from './content-blocks/KeyTermsBox';
import { AnalogyBox } from './content-blocks/AnalogyBox';
import { HistoricalContextBox } from './content-blocks/HistoricalContextBox';

const blockComponentMap: { [key: string]: React.ComponentType<any> } = {
  InfoBox,
  WarningBox,
  SuccessBox,
  CodeBlock,
  TerminalBlock,
  ChallengeBox,
  TableBlock,
  KeyTermsBox,
  AnalogyBox,
  HistoricalContextBox,
};

interface ContentBlock {
  type: keyof typeof blockComponentMap;
  data: any;
}

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div>
      {blocks.map((block, index) => {
        const Component = blockComponentMap[block.type];
        if (!Component) {
          console.warn(`[ContentRenderer] No component found for block type: ${block.type}`);
          return null;
        }
        return <Component key={`${block.type}-${index}`} data={block.data} />;
      })}
    </div>
  );
}
