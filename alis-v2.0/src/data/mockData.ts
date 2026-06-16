/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AcademicResource, AuditLog, UserAccount } from '../types';

export const mockResources: AcademicResource[] = [
  {
    id: "res-1",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones"],
    year: 2017,
    type: "paper",
    relevanceScore: 99,
    confidenceIndicator: 98,
    abstract: "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
    doi: "10.48550/arXiv.1706.03762",
    department: "Computer Science",
    availability: true,
    accessLevel: "Public",
    relatedResourcesCount: 18,
    citationsCount: 112450,
    publisher: "Advances in Neural Information Processing Systems (NeurIPS)"
  },
  {
    id: "res-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
    year: 2018,
    type: "paper",
    relevanceScore: 95,
    confidenceIndicator: 94,
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    doi: "10.48550/arXiv.1810.04805",
    department: "Computer Science",
    availability: true,
    accessLevel: "Public",
    relatedResourcesCount: 12,
    citationsCount: 88400,
    publisher: "NAACL-HLT"
  },
  {
    id: "res-3",
    title: "Language Models are Few-Shot Learners",
    authors: ["Tom B. Brown", "Benjamin Mann", "Nick Ryder", "Melanie Subbiah", "Jared Kaplan"],
    year: 2020,
    type: "paper",
    relevanceScore: 92,
    confidenceIndicator: 91,
    abstract: "We demonstrate that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even competitive with prior state-of-the-art fine-tuning approaches. We train GPT-3, an autoregressive language model with 175 billion parameters, and evaluate its performance on over two dozen NLP datasets.",
    doi: "10.48550/arXiv.2005.14165",
    department: "Computer Science",
    availability: false,
    accessLevel: "Institutional",
    relatedResourcesCount: 22,
    citationsCount: 34100,
    publisher: "NeurIPS 2020"
  },
  {
    id: "res-4",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "Fabio Petroni", "Mike Lewis"],
    year: 2020,
    type: "paper",
    relevanceScore: 98,
    confidenceIndicator: 96,
    abstract: "Large pre-trained language models have been shown to store impressive amounts of semantic knowledge. However, they struggle with updating their knowledge base, hallucinate details, and lack precise attribution. We introduce RAG, a hybrid conceptual model combining dense passage retrievers and sequence-to-sequence generators to produce fully cited grounded answers.",
    doi: "10.48550/arXiv.2005.11401",
    department: "Computer Science",
    availability: true,
    accessLevel: "Public",
    relatedResourcesCount: 15,
    citationsCount: 12900,
    publisher: "NeurIPS 2020"
  },
  {
    id: "res-5",
    title: "Quantum Computation and Quantum Information (10th Anniversary)",
    authors: ["Michael A. Nielsen", "Isaac L. Chuang"],
    year: 2010,
    type: "book",
    relevanceScore: 88,
    confidenceIndicator: 90,
    abstract: "One of the most highly cited books in physics, this classic comprehensive textbook provides a thorough introduction to the groundbreaking framework of quantum information science and quantum computing algorithms.",
    doi: "10.1017/CBO9780511976667",
    department: "Physics",
    availability: true,
    accessLevel: "Restricted",
    relatedResourcesCount: 8,
    citationsCount: 52100,
    publisher: "Cambridge University Press",
    pages: 702
  },
  {
    id: "res-6",
    title: "Deep Learning for Global Climate Modeling and Multi-decadal Projections",
    authors: ["Sarah Jenkins", "Hiroshi Matsumoto", "David Alistair"],
    year: 2023,
    type: "journal",
    relevanceScore: 84,
    confidenceIndicator: 89,
    abstract: "This study evaluates the effectiveness of deep spatial-temporal convolutional LSTM networks compared to traditional climate prediction simulators like CMIP6. We demonstrate a 40% reduction in computational latency while maintaining highly calibrated precipitation and surface temperature forecasting capabilities.",
    doi: "10.1075/jcli.2023.0142",
    department: "Earth Sciences",
    availability: true,
    accessLevel: "Institutional",
    relatedResourcesCount: 9,
    citationsCount: 430,
    publisher: "Journal of Climate Intel"
  },
  {
    id: "res-7",
    title: "Structural Engineering under Seismic Constraints: A New Era of Viscous Dampers",
    authors: ["Carlos Mendoza", "Amara Okafor"],
    year: 2021,
    type: "thesis",
    relevanceScore: 78,
    confidenceIndicator: 85,
    abstract: "Doctoral dissertation submitted to the Department of Civil Engineering. This research presents active mechanical feedback algorithms targeting high-rise building joints subjected to real-time earthquake vibrations using embedded micro-accelerometers.",
    doi: "10.26821/thes.mit.2021.091",
    department: "Engineering",
    availability: true,
    accessLevel: "Institutional",
    relatedResourcesCount: 6,
    citationsCount: 85,
    publisher: "MIT Institutional Repository"
  },
  {
    id: "res-8",
    title: "Gene Editing with CRISPR-Cas9: Therapeutic Progress, Bioethical Frameworks, and Global Policy",
    authors: ["Elena Rostova", "Julian Savulescu"],
    year: 2022,
    type: "book",
    relevanceScore: 81,
    confidenceIndicator: 87,
    abstract: "An exhaustive academic review combining cutting-edge molecular immunology with clinical bioethics, assessing global regulatory protocols for germline therapies and human somatic gene trials.",
    doi: "10.1002/crispr.221045",
    department: "Biosciences",
    availability: true,
    accessLevel: "Public",
    relatedResourcesCount: 14,
    citationsCount: 220,
    publisher: "Academic Press Elsevier",
    pages: 412
  },
  {
    id: "res-9",
    title: "A History of the Western Institutional Archive: Power, Classification, and the Rise of Systemic Cataloging",
    authors: ["Gregory L. Thomas"],
    year: 2019,
    type: "book",
    relevanceScore: 70,
    confidenceIndicator: 80,
    abstract: "A critical historical sociology detailing how university library cataloging systems evolved from early imperial vaults to standardized electronic indexes, analyzing the cultural biases embedded within early catalog codes.",
    doi: "10.1086/archive.hist.2019.45",
    department: "Humanities",
    availability: true,
    accessLevel: "Public",
    relatedResourcesCount: 4,
    citationsCount: 95,
    publisher: "University of Chicago Press",
    pages: 320
  },
  {
    id: "res-10",
    title: "Llama 3: Open Foundation and Fine-Tuned Chat Models for Enterprise Workloads",
    authors: ["Hugo Touvron", "Louis Martin", "Kevin Stone", "Albert Zhang"],
    year: 2024,
    type: "paper",
    relevanceScore: 91,
    confidenceIndicator: 93,
    abstract: "We introduce Llama 3, a suite of pre-trained and fine-tuned large language models in sizes ranging from 8B to 400B parameters. Our chat-optimized models outperform proprietary benchmarks on multiple reasoning, tool utility, and academic coding evaluation tasks.",
    doi: "10.48550/arXiv.2407.12345",
    department: "Computer Science",
    availability: true,
    accessLevel: "Public",
    relatedResourcesCount: 11,
    citationsCount: 1540,
    publisher: "Meta AI Research Publication"
  }
];

export const mockUsers: UserAccount[] = [
  { id: "u-1", name: "Sarah Connor", email: "sarah.connor@university.edu", role: "Student", institution: "Stanford University", joined: "2024-09-12" },
  { id: "u-2", name: "Dr. Alistair Vance", email: "a.vance@university.edu", role: "Faculty", institution: "Stanford University", joined: "2018-02-28" },
  { id: "u-3", name: "Robert Miller", email: "r.miller@library.edu", role: "Librarian", institution: "Stanford University Library", joined: "2015-05-14" },
  { id: "u-4", name: "Admin Chief", email: "admin.alis@university.edu", role: "Admin", institution: "AI Laboratory Systems", joined: "2020-01-01" }
];

export const mockAuditLogs: AuditLog[] = [
  { id: "log-1", user: "sarah.connor@university.edu", role: "Student", action: "Search Query", target: "Semantic Search: 'Transformer self-attention limits'", ip: "10.142.12.101", timestamp: "2026-06-15 22:45:12" },
  { id: "log-2", user: "a.vance@university.edu", role: "Faculty", action: "Download Resource", target: "BERT Pre-training PDF (ID: res-2)", ip: "10.142.45.22", timestamp: "2026-06-15 21:12:00" },
  { id: "log-3", user: "r.miller@library.edu", role: "Librarian", action: "Dataset Ingestion", target: "Ingested 'Llama 3 Foundation Paper' (ID: res-10)", ip: "192.168.1.115", timestamp: "2026-06-15 19:30:45" },
  { id: "log-4", user: "admin.alis@university.edu", role: "Admin", action: "System Configuration Change", target: "Updated RAG temperature to 0.2", ip: "10.142.1.2", timestamp: "2026-06-15 18:15:30" },
  { id: "log-5", user: "sarah.connor@university.edu", role: "Student", action: "Chat Ask AI", target: "RAG Query: 'Transformer architectures vs LSTM'", ip: "10.142.12.101", timestamp: "2026-06-15 17:02:11" },
  { id: "log-6", user: "r.miller@library.edu", role: "Librarian", action: "Metadata Update", target: "Modified Quantum Information abstract (ID: res-5)", ip: "192.168.1.115", timestamp: "2026-06-15 14:48:22" }
];

// High-fidelity knowledge graph configuration
export const graphNodes = [
  // Center Theme/Topic Nodes
  { id: "nlp", label: "Natural Language Processing", type: "topic", x: 400, y: 300, size: 28 },
  { id: "transformers", label: "Transformer Architectures", type: "topic", x: 450, y: 180, size: 24 },
  { id: "quantum", label: "Quantum Computation", type: "topic", x: 180, y: 150, size: 22 },
  { id: "climate", label: "Climate Intelligence", type: "topic", x: 680, y: 350, size: 20 },
  { id: "crispr", label: "Genome Editing", type: "topic", x: 150, y: 400, size: 20 },

  // Papers/Books Nodes
  { id: "res-1", label: "Attention Is All You Need", type: "paper", x: 580, y: 140, size: 18 },
  { id: "res-2", label: "BERT Pre-training", type: "paper", x: 320, y: 110, size: 17 },
  { id: "res-3", label: "Language Models (GPT-3)", type: "paper", x: 550, y: 260, size: 16 },
  { id: "res-4", label: "RAG Systems", type: "paper", x: 280, y: 240, size: 18 },
  { id: "res-5", label: "Quantum Comp textbook", type: "book", x: 140, y: 240, size: 16 },
  { id: "res-6", label: "Climate Modeling paper", type: "journal", x: 620, y: 450, size: 15 },
  { id: "res-10", label: "Llama 3 Foundation", type: "paper", x: 480, y: 80, size: 16 },

  // Authors Nodes
  { id: "auth-vaswani", label: "A. Vaswani", type: "author", x: 660, y: 100, size: 14 },
  { id: "auth-devlin", label: "J. Devlin", type: "author", x: 270, y: 70, size: 14 },
  { id: "auth-lewis", label: "P. Lewis", type: "author", x: 220, y: 200, size: 14 },
  { id: "auth-nielsen", label: "M. Nielsen", type: "author", x: 80, y: 180, size: 14 },
  { id: "auth-jenkins", label: "S. Jenkins", type: "author", x: 750, y: 390, size: 13 }
];

export const graphLinks = [
  // Links between topics and papers
  { source: "transformers", target: "nlp" },
  { source: "res-1", target: "transformers" },
  { source: "res-2", target: "transformers" },
  { source: "res-3", target: "transformers" },
  { source: "res-10", target: "transformers" },
  { source: "res-4", target: "nlp" },
  { source: "res-2", target: "nlp" },
  
  // Topic link to books/journals/theses
  { source: "res-5", target: "quantum" },
  { source: "res-6", target: "climate" },

  // Citation links (papers citing papers)
  { source: "res-2", target: "res-1" },
  { source: "res-3", target: "res-1" },
  { source: "res-4", target: "res-2" },
  { source: "res-4", target: "res-1" },
  { source: "res-10", target: "res-1" },
  { source: "res-10", target: "res-3" },

  // Author connections
  { source: "auth-vaswani", target: "res-1" },
  { source: "auth-devlin", target: "res-2" },
  { source: "auth-lewis", target: "res-4" },
  { source: "auth-nielsen", target: "res-5" },
  { source: "auth-jenkins", target: "res-6" }
];

// Preset Q&A database for Ask AI Page
export interface AISolution {
  answer: string;
  confidence: number;
  sources: string[]; // matching Resource IDs
  evidence: { claim: string; evidence: string; source: string }[];
  citations: string[];
}

export const aiSolutionsPresetMap: Record<string, AISolution> = {
  "explain the major contributions of transformer architectures in natural language processing.": {
    answer: "The **Transformer architecture**, originally introduced by Vaswani et al. (2017) in *'Attention Is All You Need'* [1], fundamentally revolutionized Natural Language Processing (NLP). \n\n### Core Innovations and Contributions:\n\n1. **Elimination of Recurrent Structures**: Unlike previous state-of-the-art models like LSTMs and GRUs, Transformers do not process tokens sequentially. Instead, they handle all tokens simultaneously, allowing for **unprecedented parallelization** during model training.\n\n2. **The Self-Attention Mechanism**: This lies at the heart of the Transformer. Every token in a sequence directly interacts with every other token, calculating contextual weights. This allows the network to model **long-range dependencies** regardless of their distance in the text [1].\n\n3. **Multi-Head Attention**: Rather than computing a single attention representation, the model splits queries, keys, and values into multiple projection subspaces. This enables the attention engine to jointly attend to information from different representation spaces and positions [1].\n\n4. **Catalyst for Pre-training (BERT, GPT)**: By enabling massive scalability across hundreds of GPUs, the Transformer directly enabled self-supervised bidirected training (BERT [2]) and autoregressive generation (GPT series [3]). BERT leverages the bidirectional context [2], while GPT scales up parameters to demonstrate emergence of competitive **few-shot capabilities** without task-specific tuning [3].",
    confidence: 98,
    sources: ["res-1", "res-2", "res-3"],
    citations: ["Attention Is All You Need (Vaswani et al., 2017)", "BERT Deep Bidirectional Transformers (Devlin et al., 2018)", "Language Models are Few-Shot Learners (Brown et al., 2020)"],
    evidence: [
      {
        claim: "Transformers completely replaced recurrent neural networks (RNNs) for language sequence translation tasks.",
        evidence: "The Transformer achieves superior translation quality while requiring significantly less time to train, achieving a new state of the art at 28.4 BLEU.",
        source: "Attention Is All You Need, Section 1"
      },
      {
        claim: "Self-attention helps capture long-term semantic context in deep networks.",
        evidence: "The path length between any two words is constant sub-layer O(1), bypassing the exponential decay of gradients in recurrent structures.",
        source: "Attention Is All You Need, Section 4"
      },
      {
        claim: "Bidirectional training provides deeper linguistic context representation.",
        evidence: "BERT obtains state-of-the-art results on eleven NLP tasks, demonstrating the critical importance of bidirectional representations.",
        source: "BERT Pre-training, Section 5.1"
      }
    ]
  },
  "what is retrieval-augmented generation and how does it prevent hallucinations?": {
    answer: "**Retrieval-Augmented Generation (RAG)** [1] represents a paradigm shift in bridging parametric knowledge (the knowledge stored inside an LLM's weights) with non-parametric knowledge (an external database, such as a specialized college library indices).\n\n### How RAG Prevents Semantic Hallucinations:\n\n1. **Grounded Source Injection**: When a user queries a RAG system, a dense passage retriever searches a vector store (like ChromaDB). The top-k relevant material chunks are formulated directly into the context window of the generator.\n\n2. **Citation Auditing**: By linking the prompt's source constraints to real resource indices, the LLM is restricted to synthesize facts solely from the retrieved documents [1].\n\n3. **Real-time Synchronization**: LLM parametric knowledge is static and expensive to update. RAG circumvents high retraining costs by indexing newly published books, theses, or circulars instantaneously [1].",
    confidence: 96,
    sources: ["res-4"],
    citations: ["Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)"],
    evidence: [
      {
        claim: "RAG improves factual generation on knowledge-intensive question answering.",
        evidence: "RAG models produce answers that are more factual, specific, and diverse compared to standard parametric-only model baselines.",
        source: "RAG NLP Tasks, Section 4.2"
      }
    ]
  },
  "explain the foundation level introduction of quantum computation algorithms.": {
    answer: "Quantum computing operates on state vectors that leverage linear algebraic principles to process information. Michael Nielsen and Isaac Chuang's foundational textbook [1] details these key criteria:\n\n1. **Superposition**: Qubits exist in linear combinations of states $|0\\rangle$ and $|1\\rangle$.\n2. **Entanglement**: Generates non-local correlations that classical logic gates cannot replicate.\n3. **Quantum Algorithms**: Shor's algorithm provides exponential speedups for factoring large integers, while Grover's search algorithm provides quadratic speedup for unstructured searching.",
    confidence: 90,
    sources: ["res-5"],
    citations: ["Quantum Computation and Quantum Information (Nielsen & Chuang, 2010)"],
    evidence: [
      {
        claim: "Quantum algorithms provide high-order mathematical speedups over standard Von Neumann architectures.",
        evidence: "Text details Shor's polynomial-time prime factorization which compromises traditional RSA secure keys.",
        source: "Quantum Computation, Chapter 5"
      }
    ]
  }
};
