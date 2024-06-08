pipeline{
        agent any
	     stages{
		stage("deployment"){
			steps{
			     sh 'tar -cvzf dist.tar.gz *'
			     sh 'ssh jenkins@utilities.divami.com "cd /var/www/html/qa-automation-be/ && sudo rm -rf *"'
	        	     sh 'scp dist.tar.gz jenkins@utilities.divami.com:/var/www/html/qa-automation-be'
  			     sh 'ssh jenkins@utilities.divami.com "cd /var/www/html/qa-automation-be/ && tar -xvzf dist.tar.gz"'
			     sh 'ssh jenkins@utilities.divami.com "cd /var/www/html/qa-automation-be/ && sudo chown -R jenkins:jenkins *"'
			     sh 'ssh jenkins@utilities.divami.com "cd /var/www/html/qa-automation-be/ && sudo npm install"'
	                     sh 'ssh jenkins@utilities.divami.com "cd /var/www/html/qa-automation-be/ && sudo chmod 777 constants"'
			     sh 'ssh jenkins@utilities.divami.com "cd /var/www/html/qa-automation-be/ && sudo chmod 777 uploads"'
			     sh 'ssh jenkins@utilities.divami.com "cd /var/www/html/qa-automation-be/ && sudo chmod 777 users"'
			     sh 'ssh jenkins@utilities.divami.com "sudo systemctl restart backend.service"'
			}
		}
	}
     post{
        always {
            cleanWs()
        }
     }
}
