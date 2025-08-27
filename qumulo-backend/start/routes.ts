import router from '@adonisjs/core/services/router'
import ClustersController from '#controllers/clusters_controller'
import PoliciesController from '#controllers/policies_controller'
import MetricsController from '#controllers/metrics_controller'

router.get('/api/clusters', [ClustersController, 'list'])
router.post('/api/clusters', [ClustersController, 'create'])
router.get('/api/clusters/:id/metrics', [MetricsController, 'index'])
router.get('/api/clusters/:id/snapshot-policy', [PoliciesController, 'show'])
router.put('/api/clusters/:id/snapshot-policy', [PoliciesController, 'upsert'])
