import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Tag, Clock, ArrowRight, BookOpen, TrendingUp, Eye, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  authorId: string;
  authorAvatar: string;
  publishedAt: Date;
  status: 'draft' | 'published' | 'archived';
  categories: string[];
  tags: string[];
  featuredImage: string;
  readTime: number;
  views: number;
  comments: number;
  featured: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - Articles de blog représentatifs
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Les Secrets d\'une Frite Parfaite : Guide Complet 2024',
      content: 'Découvrez tous les secrets pour réussir des frites parfaites...',
      excerpt: 'Apprenez les techniques professionnelles pour obtenir des frites dorées et croustillantes à chaque fois.',
      slug: 'secrets-frite-parfaite-guide-2024',
      author: 'Chef Marie Dubois',
      authorId: 'marie-dubois',
      authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      publishedAt: new Date('2024-02-20'),
      status: 'published',
      categories: ['Techniques', 'Guides'],
      tags: ['frites', 'cuisson', 'techniques', 'professionnel'],
      featuredImage: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      readTime: 8,
      views: 1247,
      comments: 23,
      featured: true,
      seo: {
        title: 'Guide Complet : Les Secrets d\'une Frite Parfaite',
        description: 'Découvrez les techniques professionnelles pour réussir des frites parfaites',
        keywords: ['frites', 'cuisson', 'techniques', 'friterie']
      }
    },
    {
      id: '2',
      title: 'Équipement Professionnel : Choisir sa Friteuse en 2024',
      content: 'Guide d\'achat complet pour choisir la meilleure friteuse...',
      excerpt: 'Comparatif détaillé des meilleures friteuses professionnelles du marché avec conseils d\'experts.',
      slug: 'equipement-professionnel-choisir-friteuse-2024',
      author: 'Pierre Delacroix',
      authorId: 'pierre-delacroix',
      authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      publishedAt: new Date('2024-02-15'),
      status: 'published',
      categories: ['Équipement', 'Guides'],
      tags: ['friteuse', 'équipement', 'professionnel', 'achat'],
      featuredImage: 'https://images.pexels.com/photos/4253312/pexels-photo-4253312.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      readTime: 12,
      views: 892,
      comments: 15,
      featured: false,
      seo: {
        title: 'Guide d\'Achat : Choisir sa Friteuse Professionnelle',
        description: 'Comparatif des meilleures friteuses professionnelles',
        keywords: ['friteuse', 'équipement', 'professionnel', 'guide']
      }
    },
    {
      id: '3',
      title: 'Tendances Friterie 2024 : Innovation et Tradition',
      content: 'Les nouvelles tendances qui transforment le monde de la friterie...',
      excerpt: 'Découvrez comment les friteries modernes allient innovation technologique et tradition belge.',
      slug: 'tendances-friterie-2024-innovation-tradition',
      author: 'Sophie Lambert',
      authorId: 'sophie-lambert',
      authorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      publishedAt: new Date('2024-02-10'),
      status: 'published',
      categories: ['Tendances', 'Innovation'],
      tags: ['tendances', 'innovation', 'modernité', '2024'],
      featuredImage: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      readTime: 6,
      views: 1456,
      comments: 31,
      featured: true,
      seo: {
        title: 'Tendances Friterie 2024 : Innovation et Tradition',
        description: 'Les nouvelles tendances qui transforment la friterie belge',
        keywords: ['tendances', 'friterie', 'innovation', 'tradition']
      }
    },
    {
      id: '4',
      title: 'Marketing Digital pour Friteries : Stratégies Gagnantes',
      content: 'Comment développer sa clientèle grâce au marketing digital...',
      excerpt: 'Stratégies marketing spécialement adaptées aux friteries pour attirer et fidéliser la clientèle.',
      slug: 'marketing-digital-friteries-strategies-gagnantes',
      author: 'Jean-Baptiste Dumont',
      authorId: 'jean-baptiste-dumont',
      authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      publishedAt: new Date('2024-02-05'),
      status: 'published',
      categories: ['Marketing', 'Business'],
      tags: ['marketing', 'digital', 'stratégie', 'clientèle'],
      featuredImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      readTime: 10,
      views: 734,
      comments: 18,
      featured: false,
      seo: {
        title: 'Marketing Digital pour Friteries : Guide Complet',
        description: 'Stratégies marketing adaptées aux friteries modernes',
        keywords: ['marketing', 'friterie', 'digital', 'stratégie']
      }
    },
    {
      id: '5',
      title: 'Hygiène et Sécurité : Normes HACCP en Friterie',
      content: 'Guide complet des normes d\'hygiène et de sécurité...',
      excerpt: 'Tout ce qu\'il faut savoir sur les normes HACCP et leur application dans une friterie.',
      slug: 'hygiene-securite-normes-haccp-friterie',
      author: 'Dr. Anne Moreau',
      authorId: 'anne-moreau',
      authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      publishedAt: new Date('2024-01-30'),
      status: 'published',
      categories: ['Sécurité', 'Réglementation'],
      tags: ['hygiène', 'sécurité', 'HACCP', 'normes'],
      featuredImage: 'https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      readTime: 15,
      views: 567,
      comments: 12,
      featured: false,
      seo: {
        title: 'Normes HACCP en Friterie : Guide Complet',
        description: 'Guide des normes d\'hygiène et sécurité en friterie',
        keywords: ['HACCP', 'hygiène', 'sécurité', 'friterie']
      }
    },
    {
      id: '6',
      title: 'Recettes Traditionnelles Belges : Au-delà des Frites',
      content: 'Découvrez les spécialités belges à proposer dans votre friterie...',
      excerpt: 'Élargissez votre menu avec des recettes traditionnelles belges authentiques et savoureuses.',
      slug: 'recettes-traditionnelles-belges-au-dela-frites',
      author: 'Chef Marie Dubois',
      authorId: 'marie-dubois',
      authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      publishedAt: new Date('2024-01-25'),
      status: 'published',
      categories: ['Recettes', 'Tradition'],
      tags: ['recettes', 'belge', 'tradition', 'menu'],
      featuredImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      readTime: 7,
      views: 923,
      comments: 27,
      featured: true,
      seo: {
        title: 'Recettes Traditionnelles Belges pour Friteries',
        description: 'Découvrez les spécialités belges authentiques',
        keywords: ['recettes', 'belge', 'tradition', 'friterie']
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous les articles', count: mockPosts.length },
    { id: 'Techniques', name: 'Techniques', count: mockPosts.filter(post => post.categories.includes('Techniques')).length },
    { id: 'Équipement', name: 'Équipement', count: mockPosts.filter(post => post.categories.includes('Équipement')).length },
    { id: 'Tendances', name: 'Tendances', count: mockPosts.filter(post => post.categories.includes('Tendances')).length },
    { id: 'Marketing', name: 'Marketing', count: mockPosts.filter(post => post.categories.includes('Marketing')).length },
    { id: 'Sécurité', name: 'Sécurité', count: mockPosts.filter(post => post.categories.includes('Sécurité')).length },
    { id: 'Recettes', name: 'Recettes', count: mockPosts.filter(post => post.categories.includes('Recettes')).length }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.categories.includes(selectedCategory));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <BookOpen className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-100 font-medium">Blog MonFritkot</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              Blog <span className="text-yellow-300">Expert</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 leading-relaxed">
              Conseils d'experts, guides pratiques et actualités 
              du monde de la friterie belge
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {posts.length} articles
              </span>
              <span className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {posts.reduce((sum, post) => sum + post.views, 0)} vues
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-sm'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-2 rounded-lg mr-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Articles à la une</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        À la une
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(post.publishedAt, 'dd MMMM yyyy', { locale: fr })}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} min
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">{post.author}</span>
                      </div>
                      
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center group"
                      >
                        Lire la suite
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg mr-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tous les articles</h2>
          </div>

          {regularPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {post.categories.slice(0, 2).map((category, index) => (
                        <span key={index} className="bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(post.publishedAt, 'dd MMM', { locale: fr })}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime} min
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-600">{post.author}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.comments}
                        </span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-orange-600 hover:text-orange-700 font-medium flex items-center group"
                        >
                          Lire
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Restez <span className="text-yellow-300">informé</span>
            </h2>
            <p className="text-xl mb-10 text-orange-100 leading-relaxed">
              Recevez nos derniers articles et conseils d'experts directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                S'abonner
              </button>
            </div>
            <p className="text-sm text-orange-200 mt-4">
              Pas de spam, désabonnement en un clic
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;