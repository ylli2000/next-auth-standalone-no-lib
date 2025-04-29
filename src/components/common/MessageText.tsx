type MessageVariant = 'error' | 'success' | 'warning' | 'info' | 'default';

interface MessageTextProps {
    message: string;
    variant?: MessageVariant;
    className?: string;
}

/**
 * MessageText component that properly formats text with newline characters
 * by converting them into a bulleted list when needed. Includes styling variants
 * for different message types (error, success, warning, info).
 * Also handles markdown-style links: [link text](url)
 */
export default function MessageText({ message, variant = 'default', className = '' }: MessageTextProps) {
    // Define variant-based styling
    const variantStyles: Record<MessageVariant, string> = {
        error: 'bg-red-100 border border-red-400 text-red-700',
        success: 'bg-green-100 border border-green-400 text-green-700',
        warning: 'bg-amber-100 border border-amber-400 text-amber-700',
        info: 'bg-blue-100 border border-blue-400 text-blue-700',
        default: ''
    };

    // Combine styling
    const containerStyle = `p-3 rounded ${variantStyles[variant]} ${className}`;

    // Function to convert markdown links to HTML links
    const convertMarkdownLinks = (text: string) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = text.split(linkRegex);
        const result = [];

        for (let i = 0; i < parts.length; i++) {
            if (i % 3 === 0) {
                // Regular text
                result.push(parts[i]);
            } else if (i % 3 === 1) {
                // Link text
                const linkText = parts[i];
                const linkUrl = parts[i + 1];
                result.push(
                    <a
                        key={i}
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        {linkText}
                    </a>
                );
                i++; // Skip the URL part as we've used it
            }
        }

        return result;
    };

    // Content component based on message format
    const ContentComponent = () => {
        // Check if the message contains newlines
        if (message.includes('\n')) {
            // Split by newline and render as list
            const messageLines = message.split('\n').filter((line) => line.trim() !== '');
            return (
                <ul className="list-disc pl-5 space-y-1">
                    {messageLines.map((line, index) => (
                        <li key={index}>{convertMarkdownLinks(line)}</li>
                    ))}
                </ul>
            );
        }

        // Single line message
        return <p>{convertMarkdownLinks(message)}</p>;
    };

    return (
        <div className={containerStyle}>
            <ContentComponent />
        </div>
    );
}
