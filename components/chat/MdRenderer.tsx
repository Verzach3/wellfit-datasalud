import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { List, Table, Text, Title } from '@mantine/core';

function MdRenderer({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <Text>{children}</Text>,
        table: ({ children }) => <Table withTableBorder withColumnBorders>{children}</Table>,
        thead: ({ children }) => <Table.Thead>{children}</Table.Thead>,
        tbody: ({ children }) => <Table.Tbody>{children}</Table.Tbody>,
        tr: ({ children }) => <Table.Tr>{children}</Table.Tr>,
        th: ({ children }) => <Table.Th>{children}</Table.Th>,
        td: ({ children }) => <Table.Td>{children}</Table.Td>,
        h1: ({ children }) => <Title>{children}</Title>,
        h2: ({ children }) => <Title order={2}>{children}</Title>,
        h3: ({ children }) => <Title order={3}>{children}</Title>,
        h4: ({ children }) => <Title order={4}>{children}</Title>,
        h5: ({ children }) => <Title order={5}>{children}</Title>,
        h6: ({ children }) => <Title order={6}>{children}</Title>,
        ul: ({ children }) => <List>{children}</List>,
        ol: ({ children }) => <List>{children}</List>,
        li: ({ children }) => <List.Item>{children}</List.Item>,
      }}
    >
      {content}
    </Markdown>
  );
}

export default MdRenderer;