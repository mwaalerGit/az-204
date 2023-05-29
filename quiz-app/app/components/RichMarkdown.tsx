import Markdown from "markdown-to-jsx";
import { useEffect, useRef } from "react";
import clsx from "clsx";

import hljs from "highlight.js";

import CodeEditor from "~/components/CodeEditor";

interface CodeWrapperProps {
  children: string;
  className: string;
}

const PreWrapper = ({ children }: any) => children;

function CodeBlock({ children, className, ...props }: CodeWrapperProps) {
  const codeRef = useRef<HTMLElement>(null);
  const isBlock = /\n/.test(children);

  useEffect(() => {
    if (!codeRef.current || !isBlock) return;
    hljs.highlightElement(codeRef.current);
  }, [children, isBlock]);

  const code = (
    <code ref={codeRef} className={clsx(className, "!py-2 !px-6")} {...props}>
      {children}
    </code>
  );

  // pre is only applicable for code blocks
  return isBlock ? <pre className="bg-transparent p-0 my-0">{code}</pre> : code;
}

const CodeWrapper = ({ children, className, ...props }: CodeWrapperProps) => {
  const language = className ? className.split("-")[1] : null;
  const isBlock = /\n/.test(children);

  // NOTE: Use `csharp` or `powershell` to create immutable code block

  if (!isBlock || !language || !["cs", "ps"].includes(language))
    return (
      <CodeBlock className={className} {...props}>
        {children}
      </CodeBlock>
    );

  const value = children.trim()
    ? children
    : `${language === "cs" ? "//" : "#"} Enter your code here\n`;

  // @ts-expect-error lang is checked
  return <CodeEditor value={value} lang={language} />;
};

const interactiveOverrides = {
  pre: {
    component: PreWrapper,
  },
  code: {
    component: CodeWrapper,
  },
};

const staticOverrides = {
  pre: {
    component: PreWrapper,
  },
  code: {
    component: CodeBlock,
  },
};

interface RichMarkdownProps {
  interactive?: boolean;
  children: string;
}

export function RichMarkdown({ interactive, children }: RichMarkdownProps) {
  return (
    <Markdown
      options={{
        overrides: interactive ? interactiveOverrides : staticOverrides,
      }}
    >
      {children}
    </Markdown>
  );
}