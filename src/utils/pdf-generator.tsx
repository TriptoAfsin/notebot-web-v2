import {
  Document,
  Font,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

// Register Google Fonts with error handling
try {
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2",
        fontWeight: "normal",
      },
      {
        src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2",
        fontWeight: "bold",
      },
    ],
  });
} catch (error) {
  console.warn("Failed to register custom fonts, using default fonts:", error);
}

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica", // Fallback to built-in font
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
  },
  questionContainer: {
    marginBottom: 15,
    break: false,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 6,
  },
  questionText: {
    fontSize: 10,
    color: "#333333",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 6,
  },
  answerText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.4,
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
    borderTop: 1,
    borderTopColor: "#cccccc",
    paddingTop: 10,
  },
});

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
};

interface PDFDocumentProps {
  messages: Message[];
  maxContentLength?: number;
}

// PDF Document Component with chunking support
const ConversationPDF: React.FC<PDFDocumentProps> = ({
  messages,
  maxContentLength = 2000, // Limit content length per answer to prevent memory issues
}) => {
  // Filter out error messages and pair user questions with assistant answers
  const validMessages = messages.filter(msg => !msg.isError);
  const questionAnswerPairs: Array<{ question: Message; answer?: Message }> =
    [];

  for (let i = 0; i < validMessages.length; i++) {
    const message = validMessages[i];
    if (message.type === "user") {
      const nextMessage = validMessages[i + 1];
      questionAnswerPairs.push({
        question: message,
        answer: nextMessage?.type === "assistant" ? nextMessage : undefined,
      });
    }
  }

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return new Date().toLocaleDateString();
    }
  };

  // Enhanced markdown cleaning with length limiting
  const cleanMarkdown = (
    text: string,
    maxLength: number = maxContentLength
  ) => {
    try {
      let cleaned = text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
        .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
        .replace(/`(.*?)`/g, "$1") // Remove inline code
        .replace(/```[\s\S]*?```/g, "[Code Block]") // Replace code blocks
        .replace(/#{1,6}\s/g, "") // Remove headers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
        .replace(/\n+/g, " ") // Replace multiple newlines with space
        .trim();

      // Truncate if too long to prevent memory issues
      if (cleaned.length > maxLength) {
        cleaned =
          cleaned.substring(0, maxLength) +
          "... [Content truncated for PDF generation]";
      }

      return cleaned;
    } catch (error) {
      console.warn("Error cleaning markdown:", error);
      return "Error processing content";
    }
  };

  // Split content into chunks if there are too many Q&A pairs
  const maxPairsPerPage = 10;
  const chunks = [];
  for (let i = 0; i < questionAnswerPairs.length; i += maxPairsPerPage) {
    chunks.push(questionAnswerPairs.slice(i, i + maxPairsPerPage));
  }

  return (
    <Document>
      {chunks.map((chunk, chunkIndex) => (
        <Page key={chunkIndex} size="A4" style={styles.page}>
          {/* Header - only on first page */}
          {chunkIndex === 0 && (
            <View style={styles.header}>
              <Text style={styles.title}>TexGPT Note</Text>
              <Text style={styles.subtitle}>
                Generated on {formatDate(new Date())}
              </Text>
            </View>
          )}

          {/* Question-Answer Pairs */}
          {chunk.map((pair, index) => {
            const globalIndex = chunkIndex * maxPairsPerPage + index;
            return (
              <View key={pair.question.id} style={styles.questionContainer}>
                <Text style={styles.questionLabel}>Q{globalIndex + 1}:</Text>
                <Text style={styles.questionText}>
                  {cleanMarkdown(pair.question.content, 500)}
                </Text>

                <Text style={styles.answerLabel}>Answer:</Text>
                <Text style={styles.answerText}>
                  {pair.answer
                    ? cleanMarkdown(pair.answer.content)
                    : "No answer provided."}
                </Text>
              </View>
            );
          })}

          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              Generated by TexGPT - © NoteBot
              {chunks.length > 1 &&
                ` (Page ${chunkIndex + 1} of ${chunks.length})`}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

// Enhanced function to generate and download PDF with better error handling
export const generateConversationPDF = async (messages: Message[]) => {
  try {
    // Validate input
    if (!messages || messages.length === 0) {
      throw new Error("No messages to generate PDF");
    }

    // Filter and validate messages
    const validMessages = messages.filter(
      msg =>
        msg &&
        typeof msg.content === "string" &&
        msg.content.trim().length > 0 &&
        !msg.isError
    );

    if (validMessages.length === 0) {
      throw new Error("No valid messages found for PDF generation");
    }

    console.log(`Generating PDF with ${validMessages.length} messages...`);

    // Create PDF with memory-conscious settings
    const pdfDocument = <ConversationPDF messages={validMessages} />;

    // Generate PDF with timeout and error handling
    const pdfPromise = pdf(pdfDocument).toBlob();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("PDF generation timeout")), 30000)
    );

    const blob = (await Promise.race([pdfPromise, timeoutPromise])) as Blob;

    if (!blob || blob.size === 0) {
      throw new Error("Generated PDF is empty");
    }

    console.log(`PDF generated successfully, size: ${blob.size} bytes`);

    // Create download link with cleanup
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `texgpt-note-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5)}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up with delay to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);

    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        alert(
          "PDF generation is taking too long. Please try with fewer messages or shorter content."
        );
      } else if (
        error.message.includes("memory") ||
        error.message.includes("DataView")
      ) {
        alert(
          "Not enough memory to generate PDF. Please try with fewer messages or refresh the page."
        );
      } else {
        alert(`Failed to generate PDF: ${error.message}`);
      }
    } else {
      alert(
        "An unexpected error occurred while generating the PDF. Please try again."
      );
    }

    return false;
  }
};

// Alternative function for very large conversations - generates simplified PDF
export const generateSimplifiedPDF = async (messages: Message[]) => {
  try {
    const validMessages = messages.filter(msg => !msg.isError);

    // Create a very simple text-only version
    const SimplePDF = () => (
      <Document>
        <Page size="A4" style={{ padding: 30, fontFamily: "Helvetica" }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            TexGPT Conversation Export
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 20 }}>
            Generated on {new Date().toLocaleDateString()}
          </Text>
          {validMessages.slice(0, 20).map(msg => (
            <Text key={msg.id} style={{ fontSize: 10, marginBottom: 10 }}>
              {msg.type === "user" ? "Q: " : "A: "}
              {msg.content.substring(0, 200)}
              {msg.content.length > 200 ? "..." : ""}
            </Text>
          ))}
          {validMessages.length > 20 && (
            <Text style={{ fontSize: 10, fontStyle: "italic" }}>
              ... and {validMessages.length - 20} more messages
            </Text>
          )}
        </Page>
      </Document>
    );

    const blob = await pdf(<SimplePDF />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `texgpt-note-simple-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5)}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return true;
  } catch (error) {
    console.error("Error generating simplified PDF:", error);
    return false;
  }
};
