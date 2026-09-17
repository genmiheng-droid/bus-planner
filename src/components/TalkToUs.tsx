import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  RotateCw,
  ArrowLeft,
  Sparkles,
  Send,
  Shield,
  Heart,
  Share2,
  ThumbsUp,
  Smile,
  ChevronDown,
  Check,
} from 'lucide-react';

declare global {
  interface Window {
    disqus_config?: (this: { page?: { url?: string; identifier?: string; title?: string } }) => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: { page?: { url?: string; identifier?: string; title?: string } }) => void;
      }) => void;
    };
  }
}

interface TalkToUsProps {
  onBackToHome: () => void;
}

interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

interface CommentItem {
  id: string;
  author: string;
  initial: string;
  text: string;
  timestamp: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

const DEFAULT_REACTIONS: Reaction[] = [
  { id: 'upvote', emoji: '👍', label: 'Upvote', count: 0 },
  { id: 'funny', emoji: '😝', label: 'Funny', count: 0 },
  { id: 'love', emoji: '😍', label: 'Love', count: 0 },
  { id: 'surprised', emoji: '😮', label: 'Surprised', count: 0 },
  { id: 'angry', emoji: '😤', label: 'Angry', count: 0 },
  { id: 'sad', emoji: '😢', label: 'Sad', count: 0 },
];

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c-seed-1',
    author: 'Yiwan',
    initial: 'Y',
    text: "(Testing) Hi it's me! Really enjoying the real-time bus arrivals feature.",
    timestamp: '15 mins ago',
    upvotes: 2,
    hasUpvoted: true,
  },
];

export const TalkToUs: React.FC<TalkToUsProps> = ({ onBackToHome }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Reactions state with localStorage persistence
  const [reactions, setReactions] = useState<Reaction[]>(() => {
    try {
      const saved = localStorage.getItem('smartcommute_talk_reactions');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_REACTIONS;
  });

  const [userReaction, setUserReaction] = useState<string | null>(() => {
    try {
      return localStorage.getItem('smartcommute_user_reaction');
    } catch {
      return null;
    }
  });

  // Comments state with localStorage persistence
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem('smartcommute_talk_comments');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COMMENTS;
  });

  const [commentInput, setCommentInput] = useState('');
  const [authorName, setAuthorName] = useState('Yiwan');
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const [sortBy, setSortBy] = useState<'best' | 'newest' | 'oldest'>('best');
  const [likedThread, setLikedThread] = useState(false);

  // Save reactions
  useEffect(() => {
    try {
      localStorage.setItem('smartcommute_talk_reactions', JSON.stringify(reactions));
      if (userReaction) {
        localStorage.setItem('smartcommute_user_reaction', userReaction);
      } else {
        localStorage.removeItem('smartcommute_user_reaction');
      }
    } catch {
      // ignore
    }
  }, [reactions, userReaction]);

  // Save comments
  useEffect(() => {
    try {
      localStorage.setItem('smartcommute_talk_comments', JSON.stringify(comments));
    } catch {
      // ignore
    }
  }, [comments]);

  const totalResponses = reactions.reduce((acc, curr) => acc + curr.count, 0);

  const handleToggleReaction = (reactionId: string) => {
    setReactions((prev) =>
      prev.map((r) => {
        if (r.id === reactionId) {
          if (userReaction === reactionId) {
            return { ...r, count: Math.max(0, r.count - 1) };
          } else {
            return { ...r, count: r.count + 1 };
          }
        }
        if (r.id === userReaction && userReaction !== reactionId) {
          return { ...r, count: Math.max(0, r.count - 1) };
        }
        return r;
      })
    );
    setUserReaction((prev) => (prev === reactionId ? null : reactionId));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: authorName || 'Commuter',
      initial: (authorName || 'C').charAt(0).toUpperCase(),
      text: trimmed,
      timestamp: 'Just now',
      upvotes: 0,
      hasUpvoted: false,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput('');
  };

  const handleToggleCommentUpvote = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const upvoted = !c.hasUpvoted;
          return {
            ...c,
            hasUpvoted: upvoted,
            upvotes: upvoted ? c.upvotes + 1 : Math.max(0, c.upvotes - 1),
          };
        }
        return c;
      })
    );
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } catch {
      // fallback
    }
  };

  // Disqus setup
  const initDisqus = () => {
    setIsReloading(true);

    const origin =
      typeof window !== 'undefined' &&
      window.location &&
      window.location.origin &&
      window.location.origin !== 'null'
        ? window.location.origin
        : 'https://smartcommute.sg';

    const DISQUS_PAGE_URL = `${origin}/talk-to-us`;
    const DISQUS_PAGE_IDENTIFIER = 'smartcommute-talk-to-us';
    const DISQUS_PAGE_TITLE = 'Talk to Us - SmartCommute Community';

    try {
      if (typeof window !== 'undefined' && window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page = this.page || {};
            this.page.url = DISQUS_PAGE_URL;
            this.page.identifier = DISQUS_PAGE_IDENTIFIER;
            this.page.title = DISQUS_PAGE_TITLE;
          },
        });
        setTimeout(() => setIsReloading(false), 500);
      } else {
        window.disqus_config = function () {
          this.page = this.page || {};
          this.page.url = DISQUS_PAGE_URL;
          this.page.identifier = DISQUS_PAGE_IDENTIFIER;
          this.page.title = DISQUS_PAGE_TITLE;
        };

        const existingScript = document.getElementById('disqus-embed-script');
        if (!existingScript) {
          const d = document;
          const s = d.createElement('script');
          s.id = 'disqus-embed-script';
          s.src = 'https://bus-app-1.disqus.com/embed.js';
          s.setAttribute('data-timestamp', String(+new Date()));
          s.onload = () => setIsReloading(false);
          s.onerror = () => setIsReloading(false);
          (d.head || d.body).appendChild(s);
        } else {
          setTimeout(() => {
            try {
              if (window.DISQUS) {
                window.DISQUS.reset({
                  reload: true,
                  config: function () {
                    this.page = this.page || {};
                    this.page.url = DISQUS_PAGE_URL;
                    this.page.identifier = DISQUS_PAGE_IDENTIFIER;
                    this.page.title = DISQUS_PAGE_TITLE;
                  },
                });
              }
            } catch {
              // ignore
            }
            setIsReloading(false);
          }, 300);
        }
      }
    } catch {
      setIsReloading(false);
    }
  };

  useEffect(() => {
    initDisqus();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  }, []);

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'best') return b.upvotes - a.upvotes;
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" data-purpose="talk-to-us-view">
      {/* Top Breadcrumb / Tag & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>COMMUTER COMMUNITY & FEEDBACK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Talk to Us
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Have questions about bus routes, feedback on arrival accuracy, or feature ideas for SmartCommute SG? Join the discussion below or leave a note for our team.
          </p>
        </div>

        {/* Action Buttons Matching Screenshot */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={initDisqus}
            disabled={isReloading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-night-900 border border-night-700 hover:border-night-600 text-slate-300 hover:text-white text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-400 ${isReloading ? 'animate-spin' : ''}`} />
            <span>Reload Discussion</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Transit Home</span>
          </button>
        </div>
      </div>

      {/* 3 Feedback Categories Grid Matching Photo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        {/* Card 1: Feature Requests */}
        <div className="p-4 sm:p-5 rounded-2xl bg-night-900/90 border border-night-800 hover:border-night-700 transition">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Feature Requests</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Suggest MRT interchanges, new bus lines, or customizable alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Route & Stop Feedback */}
        <div className="p-4 sm:p-5 rounded-2xl bg-night-900/90 border border-night-800 hover:border-night-700 transition">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Route & Stop Feedback</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Found a renamed stop or timing discrepancy? Let the community know.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Community Guidelines */}
        <div className="p-4 sm:p-5 rounded-2xl bg-night-900/90 border border-night-800 hover:border-night-700 transition">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Community Guidelines</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Be respectful to fellow commuters. Spam and offensive speech are moderated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Discussion Box with Emojis & Comment Area */}
      <div className="bg-night-900 border border-night-700/80 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* "What do you think?" Section */}
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-white">What do you think?</h2>
          <p className="text-xs text-slate-400 mt-0.5">{totalResponses} Responses</p>

          {/* Emojis Reaction Row */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mt-5 overflow-x-auto py-2">
            {reactions.map((r) => {
              const isSelected = userReaction === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleToggleReaction(r.id)}
                  className={`group flex flex-col items-center gap-1 cursor-pointer transition-transform duration-150 active:scale-95 focus:outline-none ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                  title={`${r.label} (${r.count})`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow-md transition-transform group-hover:-translate-y-1">
                    {r.emoji}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-sky-400' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {r.count}
                  </span>
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-200">
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-night-700/70 my-6" />

        {/* Comment Header with Count and User Name */}
        <div className="flex items-center justify-between text-xs mb-4">
          <span className="font-bold text-slate-200">
            {comments.length} Comments
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsEditingAuthor(!isEditingAuthor)}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium py-1 px-2 rounded-lg hover:bg-night-800 transition cursor-pointer"
            >
              <Smile className="w-3.5 h-3.5 text-sky-400" />
              <span>{authorName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isEditingAuthor && (
              <div className="absolute right-0 mt-1 z-20 w-48 p-2 rounded-xl bg-night-950 border border-night-700 shadow-xl">
                <label className="block text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                  Your Display Name
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-night-900 border border-night-700 text-white focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingAuthor(false)}
                    className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Area to Add Comments (matching screenshot) */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex items-start gap-3">
            {/* Avatar initial badge */}
            <div className="w-10 h-10 rounded-full bg-night-800 border border-night-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner">
              {(authorName || 'Y').charAt(0).toUpperCase()}
            </div>

            {/* Input field with rounded border */}
            <div className="flex-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="(Testing) Hi it's me"
                className="w-full px-4 py-3 rounded-xl bg-night-950/80 border border-night-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-inner"
              />

              {/* Utility Bar below comment input (Like, Share, Sorting, Post button) */}
              <div className="flex items-center justify-between mt-2.5 px-1">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => setLikedThread(!likedThread)}
                    className={`inline-flex items-center gap-1 hover:text-white transition cursor-pointer ${
                      likedThread ? 'text-rose-400 font-medium' : ''
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedThread ? 'fill-rose-400' : ''}`} />
                    <span>{likedThread ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 hover:text-white transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedShare ? 'Copied link!' : 'Share'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {(['best', 'newest', 'oldest'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSortBy(mode)}
                        className={`capitalize px-1.5 py-0.5 rounded transition cursor-pointer ${
                          sortBy === mode
                            ? 'text-white font-bold underline underline-offset-4 decoration-sky-400'
                            : 'hover:text-slate-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!commentInput.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Rendered Comments List */}
        {sortedComments.length > 0 && (
          <div className="space-y-3.5 mb-8">
            {sortedComments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-night-950/60 border border-night-800/80 hover:border-night-700 transition"
              >
                <div className="w-8 h-8 rounded-full bg-night-800 border border-night-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                  {comment.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">
                      {comment.author}
                    </span>
                    <span className="text-[11px] text-slate-500 shrink-0">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCommentUpvote(comment.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
                        comment.hasUpvoted ? 'text-sky-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comment.upvotes > 0 ? comment.upvotes : 'Upvote'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Embedded Disqus Anchor Container */}
        <div className="mt-8 pt-6 border-t border-night-800">
          <div className="text-[11px] text-slate-400 mb-3 flex items-center justify-between">
            <span>Powered by Disqus Community Network</span>
            <span className="text-sky-400/80">#smartcommute-talk-to-us</span>
          </div>

          <div id="disqus_thread" className="disqus-container text-slate-200 min-h-[120px]"></div>

          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-brand-400 underline">
              comments powered by Disqus.
            </a>
          </noscript>
        </div>
      </div>
    </div>
  );
};
