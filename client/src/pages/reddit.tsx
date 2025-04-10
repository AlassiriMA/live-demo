import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Award,
  TrendingUp,
  Sparkles,
  Clock,
  Users,
  Search,
  MoreHorizontal,
  Plus,
  Edit
} from 'lucide-react';

// Type definitions
type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  subreddit: string;
  createdAt: string;
  votes: number;
  comments: number;
  image?: string;
  userVote?: 'up' | 'down' | null;
};

type Subreddit = {
  name: string;
  members: number;
  description: string;
  icon?: string;
  isUserJoined: boolean;
};

export default function RedditClone() {
  // State for posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'The most amazing sunset I captured yesterday evening',
      content: 'I was taking a walk along the beach when the sky turned into this incredible shade of orange and pink. Had to share this with fellow sunset enthusiasts!',
      author: 'nature_lover',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature',
      subreddit: 'r/EarthPorn',
      createdAt: '2 hours ago',
      votes: 542,
      comments: 48,
      image: 'https://images.unsplash.com/photo-1566150217714-a39ac01451a8',
      userVote: null
    },
    {
      id: 2,
      title: 'After 2 years of learning to code, I finally launched my first web app!',
      content: "It has been a long journey with lots of ups and downs, but I am happy to announce that my first project is now live. It is a tool that helps people track their daily habits and improve productivity. Would love to get your feedback!",
      author: 'dev_journey',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
      subreddit: 'r/webdev',
      createdAt: '5 hours ago',
      votes: 1259,
      comments: 127,
      userVote: 'up'
    },
    {
      id: 3,
      title: "What is a book that completely changed your perspective on life?",
      content: 'Looking for interesting book recommendations that had a profound impact on how you see the world. Please share your favorites!',
      author: 'bookworm42',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=book',
      subreddit: 'r/AskReddit',
      createdAt: '12 hours ago',
      votes: 2745,
      comments: 893,
      userVote: null
    },
    {
      id: 4,
      title: "My homemade ramen recipe that is better than restaurant quality",
      content: "After 3 years of experimenting, I finally perfected my ramen recipe. The secret is in the 24-hour bone broth and homemade noodles. Here is the full recipe...",
      author: 'ramen_master',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramen',
      subreddit: 'r/food',
      createdAt: '1 day ago',
      votes: 3891,
      comments: 312,
      image: 'https://images.unsplash.com/photo-1614563637806-1d0e645e0940',
      userVote: 'up'
    },
  ]);
  
  // State for popular communities
  const [communities, setCommunities] = useState<Subreddit[]>([
    {
      name: 'r/technology',
      members: 12500000,
      description: 'For discussion of tech news, gadgets, and all things tech-related',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech',
      isUserJoined: true
    },
    {
      name: 'r/AskReddit',
      members: 38700000,
      description: 'Ask Reddit questions and get answers',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=askreddit',
      isUserJoined: false
    },
    {
      name: 'r/funny',
      members: 42100000,
      description: "Reddit's largest humor depository",
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=funny',
      isUserJoined: true
    },
    {
      name: 'r/gaming',
      members: 36200000,
      description: 'A community for (almost) anything related to games',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=gaming',
      isUserJoined: false
    },
    {
      name: 'r/science',
      members: 28900000,
      description: 'The science subreddit, discussion of scientific research',
      icon: 'https://api.dicebear.com/7.x/shapes/svg?seed=science',
      isUserJoined: true
    }
  ]);
  
  // State for selected post (comments view)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // State for current user
  const [user, setUser] = useState({
    username: 'threadmaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master',
    karma: 4236
  });
  
  // Handle vote
  const handleVote = (postId: number, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // Calculate new vote count
        let voteChange = 0;
        if (post.userVote === voteType) {
          // Clicking the same vote type again removes the vote
          voteChange = voteType === 'up' ? -1 : 1;
          return { ...post, votes: post.votes + voteChange, userVote: null };
        } else if (post.userVote === null) {
          // New vote
          voteChange = voteType === 'up' ? 1 : -1;
          return { ...post, votes: post.votes + voteChange, userVote: voteType };
        } else {
          // Changed vote (e.g., from up to down)
          voteChange = voteType === 'up' ? 2 : -2;
          return { ...post, votes: post.votes + voteChange, userVote: voteType };
        }
      }
      return post;
    }));
  };
  
  // Format large numbers (e.g., 1.2k, 3.4m)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };
  
  // Join/leave community
  const toggleJoinCommunity = (communityName: string) => {
    setCommunities(communities.map(community => {
      if (community.name === communityName) {
        return { ...community, isUserJoined: !community.isUserJoined };
      }
      return community;
    }));
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Enhanced animation variants
  const postContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };
  
  const postItemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 1
      }
    }
  };
  
  const fadeScaleVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };
  
  const votingAnimation = {
    up: { y: -3, scale: 1.2, transition: { duration: 0.2 } },
    down: { y: 3, scale: 1.2, transition: { duration: 0.2 } },
    normal: { y: 0, scale: 1, transition: { duration: 0.2 } }
  };
  
  // Create a new post
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  const submitNewPost = () => {
    if (!newPostTitle.trim()) return;
    
    const newPost: Post = {
      id: posts.length + 1,
      title: newPostTitle,
      content: newPostContent,
      author: user.username,
      authorAvatar: user.avatar,
      subreddit: 'r/ThreadVerse',
      createdAt: 'just now',
      votes: 1,
      comments: 0,
      userVote: 'up'
    };
    
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsCreatingPost(false);
  };
  
  return (
    <AppShell>
      {/* Header with search */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-500 mr-4">ThreadVerse</div>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search ThreadVerse" 
                  className="pl-10 w-[300px] bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsCreatingPost(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block ml-2">
                  <span className="text-sm font-medium text-gray-700">u/{user.username}</span>
                  <span className="text-xs text-gray-500 block">{formatNumber(user.karma)} karma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content area */}
          <div className="md:w-2/3">
            {isCreatingPost ? (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Create a post</h2>
                <Input 
                  placeholder="Title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="mb-4"
                />
                <Textarea 
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="mb-4"
                  rows={5}
                />
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline"
                    onClick={() => setIsCreatingPost(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={submitNewPost}
                  >
                    Post
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-3 mb-6">
                <Tabs defaultValue="best">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="best" className="text-sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Best
                    </TabsTrigger>
                    <TabsTrigger value="hot" className="text-sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Hot
                    </TabsTrigger>
                    <TabsTrigger value="new" className="text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      New
                    </TabsTrigger>
                    <TabsTrigger value="top" className="text-sm">
                      <Award className="h-4 w-4 mr-2" />
                      Top
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="best" className="space-y-0">
                    <div 
                      className="flex items-center bg-gray-50 p-3 mb-3 rounded-lg cursor-pointer"
                      onClick={() => setIsCreatingPost(true)}
                    >
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Input 
                        placeholder="Create a post"
                        className="bg-white"
                        readOnly
                        onClick={(e) => {
                          e.preventDefault();
                          setIsCreatingPost(true);
                        }}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hot" className="space-y-0">
                    <p className="text-center text-gray-500 py-4">Switch to Hot posts to see what's trending</p>
                  </TabsContent>
                  
                  <TabsContent value="new" className="space-y-0">
                    <p className="text-center text-gray-500 py-4">Switch to New posts to see the latest content</p>
                  </TabsContent>
                  
                  <TabsContent value="top" className="space-y-0">
                    <p className="text-center text-gray-500 py-4">Switch to Top posts to see the most popular content</p>
                  </TabsContent>
                </Tabs>
              </Card>
            )}
            
            {/* Posts feed */}
            {!selectedPost && (
              <motion.div
                variants={postContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {posts.map(post => (
                  <motion.div 
                    key={post.id} 
                    variants={postItemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className="p-3 hover:border-orange-200 hover:shadow-md transition-all duration-300">
                      <div className="flex">
                        {/* Vote buttons */}
                        <div className="flex flex-col items-center pr-3 mr-2">
                          <motion.button 
                            className={`p-1 rounded ${post.userVote === 'up' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
                            onClick={() => handleVote(post.id, 'up')}
                            whileHover={votingAnimation.up}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowBigUp className="h-6 w-6" />
                          </motion.button>
                          <motion.span 
                            className={`text-xs font-medium my-1 ${
                              post.userVote === 'up' ? 'text-orange-500' : 
                              post.userVote === 'down' ? 'text-blue-500' : 
                              'text-gray-600'
                            }`}
                            animate={{ 
                              scale: [1, 1.2, 1],
                              transition: { duration: 0.3 }
                            }}
                            key={post.votes} // This causes animation to trigger when votes change
                          >
                            {formatNumber(post.votes)}
                          </motion.span>
                          <motion.button 
                            className={`p-1 rounded ${post.userVote === 'down' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
                            onClick={() => handleVote(post.id, 'down')}
                            whileHover={votingAnimation.down}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowBigDown className="h-6 w-6" />
                          </motion.button>
                        </div>
                        
                        {/* Post content */}
                        <div className="flex-1">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <span className="font-medium text-gray-700">{post.subreddit}</span>
                            <span className="mx-1">•</span>
                            <span>Posted by u/{post.author}</span>
                            <span className="mx-1">•</span>
                            <span>{post.createdAt}</span>
                          </div>
                          
                          <h3 
                            className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-orange-500"
                            onClick={() => setSelectedPost(post)}
                          >
                            {post.title}
                          </h3>
                          
                          <div className="mb-3">
                            <p className="text-gray-800 text-sm line-clamp-3">{post.content}</p>
                          </div>
                          
                          {post.image && (
                            <div className="mb-3">
                              <img 
                                src={post.image} 
                                alt={post.title}
                                className="rounded-md max-h-96 w-auto mx-auto"
                              />
                            </div>
                          )}
                          
                          <div className="flex text-gray-500 text-sm">
                            <button 
                              className="flex items-center p-1 rounded hover:bg-gray-100"
                              onClick={() => setSelectedPost(post)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>{post.comments} Comments</span>
                            </button>
                            <button className="flex items-center p-1 rounded hover:bg-gray-100 ml-2">
                              <Share2 className="h-4 w-4 mr-1" />
                              <span>Share</span>
                            </button>
                            <button className="flex items-center p-1 rounded hover:bg-gray-100 ml-2">
                              <Bookmark className="h-4 w-4 mr-1" />
                              <span>Save</span>
                            </button>
                            <button className="flex items-center p-1 rounded hover:bg-gray-100 ml-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Selected post with comments view */}
            {selectedPost && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button 
                  className="flex items-center text-gray-500 hover:text-orange-500 mb-4"
                  onClick={() => setSelectedPost(null)}
                  whileHover={{ x: -5, transition: { duration: 0.2 } }}
                >
                  <ArrowBigUp className="h-5 w-5 mr-1" style={{ transform: "rotate(270deg)" }} />
                  <span>Back to posts</span>
                </motion.button>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-4 mb-6 hover:shadow-md transition-shadow duration-300">
                    <div className="flex">
                      {/* Vote buttons */}
                      <div className="flex flex-col items-center pr-3 mr-2">
                        <motion.button 
                          className={`p-1 rounded ${selectedPost.userVote === 'up' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
                          onClick={() => handleVote(selectedPost.id, 'up')}
                          whileHover={votingAnimation.up}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowBigUp className="h-6 w-6" />
                        </motion.button>
                        <motion.span 
                          className={`text-xs font-medium my-1 ${
                            selectedPost.userVote === 'up' ? 'text-orange-500' : 
                            selectedPost.userVote === 'down' ? 'text-blue-500' : 
                            'text-gray-600'
                          }`}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            transition: { duration: 0.3 }
                          }}
                          key={selectedPost.votes} // This causes animation to trigger when votes change
                        >
                          {formatNumber(selectedPost.votes)}
                        </motion.span>
                        <motion.button 
                          className={`p-1 rounded ${selectedPost.userVote === 'down' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
                          onClick={() => handleVote(selectedPost.id, 'down')}
                          whileHover={votingAnimation.down}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowBigDown className="h-6 w-6" />
                        </motion.button>
                      </div>
                      
                      {/* Post content */}
                      <div className="flex-1">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <span className="font-medium text-gray-700">{selectedPost.subreddit}</span>
                          <span className="mx-1">•</span>
                          <span>Posted by u/{selectedPost.author}</span>
                          <span className="mx-1">•</span>
                          <span>{selectedPost.createdAt}</span>
                        </div>
                        
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          {selectedPost.title}
                        </h2>
                        
                        <div className="mb-4">
                          <p className="text-gray-800">{selectedPost.content}</p>
                        </div>
                        
                        {selectedPost.image && (
                          <div className="mb-4">
                            <img 
                              src={selectedPost.image} 
                              alt={selectedPost.title}
                              className="rounded-md max-h-[500px] w-auto mx-auto"
                            />
                          </div>
                        )}
                        
                        <div className="flex text-gray-500 text-sm border-t border-gray-200 pt-3 mt-3">
                          <button className="flex items-center p-1 rounded hover:bg-gray-100">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{selectedPost.comments} Comments</span>
                          </button>
                          <button className="flex items-center p-1 rounded hover:bg-gray-100 ml-3">
                            <Share2 className="h-4 w-4 mr-1" />
                            <span>Share</span>
                          </button>
                          <button className="flex items-center p-1 rounded hover:bg-gray-100 ml-3">
                            <Bookmark className="h-4 w-4 mr-1" />
                            <span>Save</span>
                          </button>
                          <button className="flex items-center p-1 rounded hover:bg-gray-100 ml-3">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="p-4 mb-6">
                    <div className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea 
                          placeholder="What are your thoughts?" 
                          className="mb-3"
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button className="bg-orange-500 hover:bg-orange-600">
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="border-t border-gray-200 pt-4"
                >
                  <h3 className="text-base font-medium text-gray-900 mb-4">Comments ({selectedPost.comments})</h3>
                  
                  {/* Sample comments */}
                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div className="flex space-x-3" variants={itemVariants}>
                      <div className="flex flex-col items-center">
                        <motion.button 
                          className="text-gray-400 hover:text-orange-500"
                          whileHover={votingAnimation.up}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowBigUp className="h-5 w-5" />
                        </motion.button>
                        <span className="text-xs my-1">86</span>
                        <motion.button 
                          className="text-gray-400 hover:text-blue-500"
                          whileHover={votingAnimation.down}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowBigDown className="h-5 w-5" />
                        </motion.button>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=comment1" />
                            <AvatarFallback>U1</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">u/comment_user1</span>
                          <span className="text-xs text-gray-500 ml-2">1 hour ago</span>
                        </div>
                        <p className="text-gray-800 text-sm mb-2">
                          This is really impressive! I've been trying to do something similar for months. 
                          Would you mind sharing the tech stack you used?
                        </p>
                        <div className="flex text-xs text-gray-500">
                          <button className="flex items-center hover:text-gray-700">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Reply
                          </button>
                          <button className="flex items-center ml-3 hover:text-gray-700">
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div className="flex space-x-3" variants={itemVariants}>
                      <div className="flex flex-col items-center">
                        <motion.button 
                          className="text-orange-500"
                          whileHover={votingAnimation.up}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowBigUp className="h-5 w-5" />
                        </motion.button>
                        <span className="text-xs my-1 text-orange-500">42</span>
                        <motion.button 
                          className="text-gray-400 hover:text-blue-500"
                          whileHover={votingAnimation.down}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowBigDown className="h-5 w-5" />
                        </motion.button>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=comment2" />
                            <AvatarFallback>U2</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">u/comment_user2</span>
                          <span className="text-xs text-gray-500 ml-2">45 minutes ago</span>
                        </div>
                        <p className="text-gray-800 text-sm mb-2">
                          I've seen similar projects, but this one has a much better UI. 
                          The attention to detail is impressive.
                        </p>
                        <div className="flex text-xs text-gray-500">
                          <button className="flex items-center hover:text-gray-700">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Reply
                          </button>
                          <button className="flex items-center ml-3 hover:text-gray-700">
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/3 space-y-6">
            {/* About community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Welcome to ThreadVerse!</h2>
                <p className="text-sm text-gray-600 mb-4">
                  A community-driven platform for discussions, sharing content, and discovering new ideas. 
                  Join the conversation!
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">2.5m</div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">12.4k</div>
                    <div className="text-xs text-gray-500">Online</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">2011</div>
                    <div className="text-xs text-gray-500">Created</div>
                  </div>
                </div>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 mb-3"
                  onClick={() => setIsCreatingPost(true)}
                >
                  Create Post
                </Button>
                <Button variant="outline" className="w-full">Create Community</Button>
              </Card>
            </motion.div>
            
            {/* Popular communities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Popular Communities</h2>
                <div className="divide-y">
                  {communities.map((community, index) => (
                    <motion.div 
                      key={community.name} 
                      className="py-3 first:pt-0 last:pb-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={community.icon} alt={community.name} />
                            <AvatarFallback>{community.name.substring(2, 4)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{community.name}</div>
                            <div className="text-xs text-gray-500">{formatNumber(community.members)} members</div>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant={community.isUserJoined ? "outline" : "default"} 
                            className={community.isUserJoined 
                              ? "text-xs h-8 border-orange-500 text-orange-500 hover:bg-orange-50" 
                              : "text-xs h-8 bg-orange-500 hover:bg-orange-600"
                            }
                            onClick={() => toggleJoinCommunity(community.name)}
                          >
                            {community.isUserJoined ? 'Joined' : 'Join'}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Button variant="ghost" className="w-full text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                    View All Communities
                  </Button>
                </div>
              </Card>
            </motion.div>
            
            {/* Subreddit rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">ThreadVerse Rules</h2>
                <ol className="list-decimal list-inside text-sm space-y-3 text-gray-700">
                  <li>Remember the human - treat others with respect</li>
                  <li>Behave like you would in real life</li>
                  <li>Look for the original source of content</li>
                  <li>Search for duplicates before posting</li>
                  <li>Read the community's rules</li>
                </ol>
              </Card>
            </motion.div>
            
            {/* footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xs text-gray-500 p-4"
            >
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                <a href="#" className="hover:underline">Help</a>
                <a href="#" className="hover:underline">ThreadVerse Coins</a>
                <a href="#" className="hover:underline">Premium</a>
                <a href="#" className="hover:underline">Communities</a>
                <a href="#" className="hover:underline">About</a>
                <a href="#" className="hover:underline">Careers</a>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                <a href="#" className="hover:underline">Terms</a>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Content Policy</a>
                <a href="#" className="hover:underline">Moderation</a>
              </div>
              <p className="mt-4">© 2025 ThreadVerse, Inc. All rights reserved.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}