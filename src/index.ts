import onGetResource from './data/index';
import Resource from './interface/Resource';

onGetResource((resource: Resource) => {
    console.log(resource);
})