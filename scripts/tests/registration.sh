# Register 50 dummy accounts
# Ensure the $NODE_IP and $TEST_REGISTER_ACCOUNT_NUM environment variables are set
# before running this test, otherwise TEST_REGISTER_ACCOUNT_NUM is set to 1000
num_accounts=${TEST_REGISTER_ACCOUNT_NUM:-100}
node_ip=${NODE_IP}

for i in `seq 1 $num_accounts`; do
    curl -X POST -H "Content-Type: application/json" http://$node_ip/account/register/ -d '{"email":"'$i'@1.com", "fname":"'$i'", "lname":"'$i'", "password":"1"}'
done;

echo "Inserted $num_accounts accounts";
echo "Waiting 5 seconds, then deleting";
sleep 5;

for i in `seq 1 $num_accounts`; do
    curl -X DELETE -H "Content-Type: application/json" http://$node_ip/account/ -d '{"email":"'$i'@1.com"}'
done;
