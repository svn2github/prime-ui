package org.primefaces.primeui.client;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.GenericType;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.json.JSONConfiguration;
import java.util.Collection;
import java.util.List;
import org.primefaces.primeui.service.Suggestion;

public class HelloServletClient {
 
    public static void main(String[] args) {
        ClientConfig clientConfig = new DefaultClientConfig();
        clientConfig.getFeatures().put(JSONConfiguration.FEATURE_POJO_MAPPING, Boolean.TRUE);
        Client client = Client.create(clientConfig);
		WebResource webResource = client.resource("http://localhost:8080/prime-ui/rest/autocomplete/rrr");
        
        //GET
        ClientResponse response = webResource.accept("application/json").get(ClientResponse.class);
        Collection<Suggestion> output = response.getEntity(new GenericType<List<Suggestion>>(){});
        
        for(Object o : output) {
            System.out.println(o);
        }
        
        //POST
        webResource = client.resource("http://localhost:8080/prime-ui/rest/autocomplete/save");
        response = webResource.type("application/json").post(ClientResponse.class, "{\"label\":\"testlabel\", \"value\":\"testvalue\"}");
        String outputString = response.getEntity(String.class);
        System.out.println("Save Response:" + outputString);
    }
}
