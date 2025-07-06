import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, FileText, Calendar, User, Tag, Search, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  authorId: string;
  publishedAt?: Date;
  status: 'draft' | 'published' | 'archived';
  categories: string[];
  tags: string[];
  featuredImage?: string;
  readTime: number;
  views: number;
  comments: number;
}

const BlogManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data pour la démonstration
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Les Secrets d\'une Frite Parfaite : Guide Complet 2024',
      content: 'Contenu complet de l\'article...',
      excerpt: 'Apprenez les techniques professionnelles pour obtenir des frites dorées et croustillantes.',
      slug: 'secrets-frite-parfaite-guide-2024',
      author: 'Chef Marie Dubois',
      authorId: 'marie-dubois',
      publishedAt: new Date('2024-02-20'),
      status: 'published',
      categories: ['Techniques', 'Guides'],
      tags: ['frites', 'cuisson', 'techniques'],
      featuredImage: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
      readTime: 8,
      views: 1247,
      comments: 23
    },
    {
      id: '2',
      title: 'Équipement Professionnel : Choisir sa Friteuse',
      content: 'Guide d\'achat complet...',
      excerpt: 'Comparatif des meilleures friteuses professionnelles du marché.',
      slug: 'equipement-professionnel-choisir-friteuse',
      author: 'Pierre Delacroix',
      authorId: 'pierre-delacroix',
      publishedAt: new Date('2024-02-15'),
      status: 'published',
      categories: ['Équipement'],
      tags: ['friteuse', 'équipement', 'professionnel'],
      readTime: 12,
      views: 892,
      comments: 15
    },
    {
      id: '3',
      title: 'Tendances Friterie 2024 : Innovation et Tradition',
      content: 'Brouillon en cours...',
      excerpt: 'Les nouvelles tendances qui transforment le monde de la friterie.',
      slug: 'tendances-friterie-2024',
      author: 'Sophie Lambert',
      authorId: 'sophie-lambert',
      status: 'draft',
      categories: ['Tendances'],
      tags: ['tendances', 'innovation', '2024'],
      readTime: 6,
      views: 0,
      comments: 0
    }
  ];

  useEffect(() => {
    // Simulation du chargement
    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, statusFilter]);

  const filterPosts = () => {
    let filtered = posts;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'draft':
        return 'Brouillon';
      case 'archived':
        return 'Archivé';
      default:
        return status;
    }
  };

  const canManageBlog = () => {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');
  };

  if (!canManageBlog()) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-gray-600">Seuls les administrateurs et éditeurs peuvent gérer le blog.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion du blog</h1>
            <p className="text-gray-600 mt-2">
              {posts.length} article{posts.length > 1 ? 's' : ''} au total
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            icon={<Plus className="h-4 w-4" />}
          >
            Nouvel article
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
              <option value="archived">Archivés</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Chargement...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600 mb-6">
              {posts.length === 0 
                ? 'Commencez par créer votre premier article'
                : 'Aucun article ne correspond à vos critères de recherche'
              }
            </p>
            <Button icon={<Plus className="h-4 w-4" />}>
              Créer un article
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {post.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.map((category, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                          {category}
                        </span>
                      ))}
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.tags.length - 3} tags</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.publishedAt.toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      <span>{post.readTime} min de lecture</span>
                      {post.status === 'published' && (
                        <>
                          <span>{post.views} vues</span>
                          <span>{post.comments} commentaires</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {post.status === 'published' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="h-4 w-4" />}
                        title="Voir l'article"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Edit className="h-4 w-4" />}
                      title="Modifier"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      icon={<Trash2 className="h-4 w-4" />}
                      title="Supprimer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.status === 'published').length}
              </div>
              <div className="text-sm text-gray-600">Articles publiés</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg mr-4">
              <Edit className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {posts.filter(p => p.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-600">Brouillons</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, post) => sum + post.views, 0)}
              </div>
              <div className="text-sm text-gray-600">Vues totales</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, post) => sum + post.comments, 0)}
              </div>
              <div className="text-sm text-gray-600">Commentaires</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;