import '../styles/markdown.css'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkToc from 'remark-toc'
import ReactMarkdown from 'react-markdown'
import { Options } from 'remark-toc'

export default function PreviewArticle(props: { markdownText: string }) {
    const options: Options = {
        heading: 'Table des matières|Sommaire',
        maxDepth: 4,
    }
    return (
        <div className='container-preview-article'>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks, [remarkToc, options]]} className='markdown'>
                {props.markdownText}
            </ReactMarkdown>

        </div>
)
}